/**
 * Tests for blog.ts - Blog Module
 */

import {
    escapeHTML,
    isValidBlogEntry,
    generateBlogCardHTML,
    createBlogCard,
    displayBlogs,
    clearBlogs,
    refreshBlogs,
    blogs
} from '../blog';

describe('escapeHTML', () => {
    test('should escape ampersand', () => {
        expect(escapeHTML('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    test('should escape less than', () => {
        expect(escapeHTML('<script>')).toBe('&lt;script&gt;');
    });

    test('should escape greater than', () => {
        expect(escapeHTML('a > b')).toBe('a &gt; b');
    });

    test('should escape double quotes', () => {
        expect(escapeHTML('He said "hello"')).toBe('He said &quot;hello&quot;');
    });

    test('should escape single quotes', () => {
        expect(escapeHTML("it's")).toBe('it&#39;s');
    });

    test('should escape forward slash', () => {
        expect(escapeHTML('a/b')).toBe('a&#x2F;b');
    });

    test('should escape backticks', () => {
        expect(escapeHTML('`code`')).toBe('&#x60;code&#x60;');
    });

    test('should escape equals sign', () => {
        expect(escapeHTML('a=b')).toBe('a&#x3D;b');
    });

    test('should handle multiple special characters', () => {
        const input = '<script>alert("XSS")</script>';
        const output = escapeHTML(input);
        expect(output).not.toContain('<');
        expect(output).not.toContain('>');
        expect(output).not.toContain('"');
    });

    test('should return empty string for empty input', () => {
        expect(escapeHTML('')).toBe('');
    });

    test('should not modify safe strings', () => {
        expect(escapeHTML('Hello World')).toBe('Hello World');
    });
});

describe('isValidBlogEntry', () => {
    test('should return true for valid blog entry', () => {
        const entry = {
            title: 'Test',
            description: 'Description',
            image: '/path/to/image.jpg',
            link: '/pages/test.html'
        };

        expect(isValidBlogEntry(entry)).toBe(true);
    });

    test('should return false for null', () => {
        expect(isValidBlogEntry(null)).toBe(false);
    });

    test('should return false for undefined', () => {
        expect(isValidBlogEntry(undefined)).toBe(false);
    });

    test('should return false for primitive types', () => {
        expect(isValidBlogEntry('string')).toBe(false);
        expect(isValidBlogEntry(123)).toBe(false);
        expect(isValidBlogEntry(true)).toBe(false);
    });

    test('should return false for missing title', () => {
        const entry = {
            description: 'Description',
            image: '/path/to/image.jpg',
            link: '/pages/test.html'
        };

        expect(isValidBlogEntry(entry)).toBe(false);
    });

    test('should return false for missing description', () => {
        const entry = {
            title: 'Test',
            image: '/path/to/image.jpg',
            link: '/pages/test.html'
        };

        expect(isValidBlogEntry(entry)).toBe(false);
    });

    test('should return false for missing image', () => {
        const entry = {
            title: 'Test',
            description: 'Description',
            link: '/pages/test.html'
        };

        expect(isValidBlogEntry(entry)).toBe(false);
    });

    test('should return false for missing link', () => {
        const entry = {
            title: 'Test',
            description: 'Description',
            image: '/path/to/image.jpg'
        };

        expect(isValidBlogEntry(entry)).toBe(false);
    });

    test('should return false for non-string title', () => {
        const entry = {
            title: 123,
            description: 'Description',
            image: '/path/to/image.jpg',
            link: '/pages/test.html'
        };

        expect(isValidBlogEntry(entry)).toBe(false);
    });
});

describe('generateBlogCardHTML', () => {
    test('should generate valid HTML string', () => {
        const blog = {
            title: 'Test Blog',
            description: 'A test description',
            image: '/image.jpg',
            link: '/test.html'
        };

        const html = generateBlogCardHTML(blog);

        expect(html).toContain('<a href="');
        expect(html).toContain('<img src="');
        expect(html).toContain('<h3>');
        expect(html).toContain('<p>');
    });

    test('should escape HTML in content', () => {
        const blog = {
            title: '<script>alert("xss")</script>',
            description: 'Test & Description',
            image: '/image.jpg',
            link: '/test.html'
        };

        const html = generateBlogCardHTML(blog);

        expect(html).not.toContain('<script>');
        expect(html).toContain('&lt;script&gt;');
        expect(html).toContain('&amp;');
    });

    test('should include all blog fields', () => {
        const blog = {
            title: 'My Title',
            description: 'My Description',
            image: '/my-image.png',
            link: '/my-page.html'
        };

        const html = generateBlogCardHTML(blog);

        expect(html).toContain('My Title');
        expect(html).toContain('My Description');
        expect(html).toContain('&#x2F;my-image.png');
        expect(html).toContain('&#x2F;my-page.html');
    });
});

describe('createBlogCard', () => {
    test('should create li element', () => {
        const blog = {
            title: 'Test',
            description: 'Description',
            image: '/image.jpg',
            link: '/test.html'
        };

        const card = createBlogCard(blog);

        expect(card.tagName).toBe('LI');
    });

    test('should add blog-card class', () => {
        const blog = {
            title: 'Test',
            description: 'Description',
            image: '/image.jpg',
            link: '/test.html'
        };

        const card = createBlogCard(blog);

        expect(card.classList.contains('blog-card')).toBe(true);
    });

    test('should contain blog content', () => {
        const blog = {
            title: 'Unique Title',
            description: 'Unique Description',
            image: '/unique.jpg',
            link: '/unique.html'
        };

        const card = createBlogCard(blog);

        expect(card.innerHTML).toContain('Unique Title');
        expect(card.innerHTML).toContain('Unique Description');
    });
});

describe('displayBlogs', () => {
    beforeEach(() => {
        document.body.innerHTML = '<ul class="grid-list"></ul>';
    });

    test('should add blog cards to grid list', () => {
        const testBlogs = [
            { title: 'Blog 1', description: 'Desc 1', image: '/1.jpg', link: '/1.html' },
            { title: 'Blog 2', description: 'Desc 2', image: '/2.jpg', link: '/2.html' }
        ] as const;

        displayBlogs(testBlogs);

        const cards = document.querySelectorAll('.blog-card');
        expect(cards.length).toBe(2);
    });

    test('should handle empty blog array', () => {
        displayBlogs([]);

        const cards = document.querySelectorAll('.blog-card');
        expect(cards.length).toBe(0);
    });

    test('should skip invalid blog entries', () => {
        const mixedBlogs = [
            { title: 'Valid', description: 'Desc', image: '/1.jpg', link: '/1.html' },
            { title: 123 } // Invalid
        ] as unknown as readonly { title: string; description: string; image: string; link: string }[];

        displayBlogs(mixedBlogs);

        const cards = document.querySelectorAll('.blog-card');
        expect(cards.length).toBe(1);
    });

    test('should handle missing grid list', () => {
        document.body.innerHTML = '';

        expect(() => displayBlogs()).not.toThrow();
    });

    test('should use default blogs when no argument provided', () => {
        displayBlogs();

        const cards = document.querySelectorAll('.blog-card');
        expect(cards.length).toBe(blogs.length);
    });
});

describe('clearBlogs', () => {
    beforeEach(() => {
        document.body.innerHTML = `
      <ul class="grid-list">
        <li class="blog-card">Blog 1</li>
        <li class="blog-card">Blog 2</li>
      </ul>
    `;
    });

    test('should remove all blog cards', () => {
        clearBlogs();

        const gridList = document.querySelector('.grid-list');
        expect(gridList?.innerHTML).toBe('');
    });

    test('should handle missing grid list', () => {
        document.body.innerHTML = '';

        expect(() => clearBlogs()).not.toThrow();
    });
});

describe('refreshBlogs', () => {
    beforeEach(() => {
        document.body.innerHTML = `
      <ul class="grid-list">
        <li class="blog-card">Old Blog</li>
      </ul>
    `;
    });

    test('should clear and redisplay blogs', () => {
        const newBlogs = [
            { title: 'New Blog 1', description: 'Desc', image: '/1.jpg', link: '/1.html' },
            { title: 'New Blog 2', description: 'Desc', image: '/2.jpg', link: '/2.html' },
            { title: 'New Blog 3', description: 'Desc', image: '/3.jpg', link: '/3.html' }
        ] as const;

        refreshBlogs(newBlogs);

        const cards = document.querySelectorAll('.blog-card');
        expect(cards.length).toBe(3);
        expect(document.body.innerHTML).not.toContain('Old Blog');
        expect(document.body.innerHTML).toContain('New Blog 1');
    });
});

describe('blogs constant', () => {
    test('should have at least 2 entries', () => {
        expect(blogs.length).toBeGreaterThanOrEqual(2);
    });

    test('should have valid entries', () => {
        blogs.forEach(blog => {
            expect(isValidBlogEntry(blog)).toBe(true);
        });
    });
});
