/**
 * SkillWise Blog Module
 * Blog rendering functionality with strict TypeScript typing
 */
// ============================================================
// Blog Data
// ============================================================
export const blogs = [
    {
        title: 'Blog Title 1',
        description: 'Short description of Blog 1.',
        image: '../assets/images/blog1.jpg',
        link: '/pages/blog1.html'
    },
    {
        title: 'Blog Title 2',
        description: 'Short description of Blog 2.',
        image: '../assets/images/blog2.jpg',
        link: '/pages/blog2.html'
    }
];
// ============================================================
// Security Functions
// ============================================================
/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHTML(str) {
    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    return str.replace(/[&<>"'`=/]/g, (char) => {
        return htmlEntities[char] ?? char;
    });
}
/**
 * Validate blog entry has required fields
 */
export function isValidBlogEntry(entry) {
    if (typeof entry !== 'object' || entry === null) {
        return false;
    }
    const obj = entry;
    return (typeof obj['title'] === 'string' &&
        typeof obj['description'] === 'string' &&
        typeof obj['image'] === 'string' &&
        typeof obj['link'] === 'string');
}
// ============================================================
// Blog Card Generation
// ============================================================
/**
 * Generate HTML for a single blog card
 */
export function generateBlogCardHTML(blog) {
    return `
    <a href="${escapeHTML(blog.link)}">
      <img src="${escapeHTML(blog.image)}" alt="${escapeHTML(blog.title)}" />
      <h3>${escapeHTML(blog.title)}</h3>
      <p>${escapeHTML(blog.description)}</p>
    </a>
  `;
}
/**
 * Create a blog card element
 */
export function createBlogCard(blog) {
    const blogCard = document.createElement('li');
    blogCard.classList.add('blog-card');
    blogCard.innerHTML = generateBlogCardHTML(blog);
    return blogCard;
}
// ============================================================
// Blog Display Functions
// ============================================================
/**
 * Get the blog list container
 */
export function getBlogListContainer() {
    return document.querySelector('.grid-list');
}
/**
 * Display all blogs in the grid
 */
export function displayBlogs(blogData = blogs) {
    const blogList = getBlogListContainer();
    if (blogList === null) {
        return;
    }
    blogData.forEach((blog) => {
        if (isValidBlogEntry(blog)) {
            const blogCard = createBlogCard(blog);
            blogList.appendChild(blogCard);
        }
    });
}
/**
 * Clear all blogs from the grid
 */
export function clearBlogs() {
    const blogList = getBlogListContainer();
    if (blogList !== null) {
        blogList.innerHTML = '';
    }
}
/**
 * Refresh blogs with new data
 */
export function refreshBlogs(blogData = blogs) {
    clearBlogs();
    displayBlogs(blogData);
}
// ============================================================
// Initialization
// ============================================================
/**
 * Initialize blog module
 */
export function initBlog() {
    displayBlogs();
}
// Auto-initialize when window loads
window.onload = () => {
    initBlog();
};
