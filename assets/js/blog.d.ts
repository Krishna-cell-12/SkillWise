/**
 * SkillWise Blog Module
 * Blog rendering functionality with strict TypeScript typing
 */
import type { BlogEntry, Nullable } from './types';
export declare const blogs: readonly BlogEntry[];
/**
 * Escape HTML special characters to prevent XSS
 */
export declare function escapeHTML(str: string): string;
/**
 * Validate blog entry has required fields
 */
export declare function isValidBlogEntry(entry: unknown): entry is BlogEntry;
/**
 * Generate HTML for a single blog card
 */
export declare function generateBlogCardHTML(blog: BlogEntry): string;
/**
 * Create a blog card element
 */
export declare function createBlogCard(blog: BlogEntry): HTMLLIElement;
/**
 * Get the blog list container
 */
export declare function getBlogListContainer(): Nullable<HTMLElement>;
/**
 * Display all blogs in the grid
 */
export declare function displayBlogs(blogData?: readonly BlogEntry[]): void;
/**
 * Clear all blogs from the grid
 */
export declare function clearBlogs(): void;
/**
 * Refresh blogs with new data
 */
export declare function refreshBlogs(blogData?: readonly BlogEntry[]): void;
/**
 * Initialize blog module
 */
export declare function initBlog(): void;
//# sourceMappingURL=blog.d.ts.map