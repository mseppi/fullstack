const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const { before } = require('node:test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'koira',
        username: '123',
        password: '123'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'kissa',
        username: '456',
        password: '456'
      }
    })
    await page.goto('http://localhost:5173')
  })


  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {

    test('User can log in', async ({ page }) => {
      loginWith(page, '123', '123')
      await expect(page.getByText('koira logged in')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('Login fails with wrong credentials', async ({ page }) => {
      loginWith(page, '123', 'wrong')
      await expect(page.getByText('wrong credentials')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, '123', '123')
    })

    test('A new blog can be created', async ({ page }) => {
      createBlog(page, 'Test Blog', 'Test Author', 'http://testblog.com')
      await expect(page.getByText('Test Blog Test Author')).toBeVisible()
    })

    test('Blogs are ordered by likes', async ({ page }) => {
      await createBlog(page, 'Blog 1', 'Author 1', 'http://blog1.com')
      await createBlog(page, 'Blog 2', 'Author 2', 'http://blog2.com')
      await createBlog(page, 'Blog 3', 'Author 3', 'http://blog3.com')

      const blog1 = page.locator('.blog').filter({ hasText: 'Blog 1' })
      const blog2 = page.locator('.blog').filter({ hasText: 'Blog 2' })
      const blog3 = page.locator('.blog').filter({ hasText: 'Blog 3' })

      await blog1.getByRole('button', { name: 'view' }).click()
      await blog2.getByRole('button', { name: 'view' }).click()
      await blog3.getByRole('button', { name: 'view' }).click()

      await blog3.getByRole('button', { name: 'like' }).click()
      await blog3.getByRole('button', { name: 'like' }).click()
      await blog2.getByRole('button', { name: 'like' }).click()

      await expect(blog3).toContainText('2')
      await expect(blog2).toContainText('1')
      await expect(blog1).toContainText('0')

      expect(page.locator('.blog').first()).toContainText('Blog 3')
      expect(page.locator('.blog').nth(1)).toContainText('Blog 2')
      expect(page.locator('.blog').last()).toContainText('Blog 1')
    })
  
    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Test Blog', 'Test Author', 'http://testblog.com')
      })

      test('A blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('1')).toBeVisible()
      })

      test('User can delete their own blog', async ({ page }) => {
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('Test Blog Test Author')).not.toBeVisible()
      })
      
      test('User cannot delete another users blog', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        loginWith(page, '456', '456')
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)
      })
    })
  })
})