/**
 * SkillWise Blog Module
 * Blog rendering functionality with strict TypeScript typing
 */

import type { BlogEntry, Nullable } from './types';

// ============================================================
// Blog Data
// ============================================================

export const blogs: readonly BlogEntry[] = [
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
] as const;

// ============================================================
// Security Functions
// ============================================================

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHTML(str: string): string {
    const htmlEntities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    return str.replace(/[&<>"'`=/]/g, (char: string): string => {
        return htmlEntities[char] ?? char;
    });
}

/**
 * Validate blog entry has required fields
 */
export function isValidBlogEntry(entry: unknown): entry is BlogEntry {
    if (typeof entry !== 'object' || entry === null) {
        return false;
    }

    const obj = entry as Record<string, unknown>;
    return (
        typeof obj['title'] === 'string' &&
        typeof obj['description'] === 'string' &&
        typeof obj['image'] === 'string' &&
        typeof obj['link'] === 'string'
    );
}

// ============================================================
// Blog Card Generation
// ============================================================

/**
 * Generate HTML for a single blog card
 */
export function generateBlogCardHTML(blog: BlogEntry): string {
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
export function createBlogCard(blog: BlogEntry): HTMLLIElement {
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
export function getBlogListContainer(): Nullable<HTMLElement> {
    return document.querySelector<HTMLElement>('.grid-list');
}

/**
 * Display all blogs in the grid
 */
export function displayBlogs(
    blogData: readonly BlogEntry[] = blogs
): void {
    const blogList = getBlogListContainer();

    if (blogList === null) {
        return;
    }

    blogData.forEach((blog: BlogEntry): void => {
        if (isValidBlogEntry(blog)) {
            const blogCard = createBlogCard(blog);
            blogList.appendChild(blogCard);
        }
    });
}

/**
 * Clear all blogs from the grid
 */
export function clearBlogs(): void {
    const blogList = getBlogListContainer();
    if (blogList !== null) {
        blogList.innerHTML = '';
    }
}

/**
 * Refresh blogs with new data
 */
export function refreshBlogs(
    blogData: readonly BlogEntry[] = blogs
): void {
    clearBlogs();
    displayBlogs(blogData);
}

// ============================================================
// Initialization
// ============================================================

/**
 * Initialize blog module
 */
export function initBlog(): void {
    displayBlogs();
}

// Auto-initialize when window loads
window.onload = (): void => {
    initBlog();
};
