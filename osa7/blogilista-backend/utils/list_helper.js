const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((acc, blog) => acc.likes > blog.likes ? acc : blog)
}

const mostBlogs = (blogs) => {
    const authors = blogs.reduce((acc, blog) => {
      if (acc[blog.author]) {
        acc[blog.author]++
      } else {
        acc[blog.author] = 1
      }
      return acc
    }, {})
  
    const author = Object.keys(authors).reduce((acc, author) => authors[author] > authors[acc] ? author : acc)
    return {
      author,
      blogs: authors[author]
    }
}

const mostLikes = (blogs) => {
    const authors = blogs.reduce((acc, blog) => {
      if (acc[blog.author]) {
        acc[blog.author] += blog.likes
      } else {
        acc[blog.author] = blog.likes
      }
      return acc
    }, {})
  
    const author = Object.keys(authors).reduce((acc, author) => authors[author] > authors[acc] ? author : acc)
    return {
      author,
      likes: authors[author]
    }
}
  
  module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
  }