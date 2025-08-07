import mockData from "@/services/mockData/blogs.json";

let blogs = [...mockData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const blogService = {
  async getAll() {
    await delay(300);
    return blogs.map(blog => ({ ...blog }));
  },

  async getById(id) {
    await delay(200);
    const blog = blogs.find(b => b.Id === id);
    if (!blog) {
      throw new Error("Blog post not found");
    }
    return { ...blog };
  },

async create(blogData) {
    await delay(400);
    const newBlog = {
      Id: Math.max(...blogs.map(b => b.Id), 0) + 1,
      ...blogData,
      isHtmlContent: blogData.isHtmlContent || false,
      createdAt: new Date().toISOString()
    };
    blogs.unshift(newBlog);
    return { ...newBlog };
  },

async update(id, updates) {
    await delay(300);
    const index = blogs.findIndex(b => b.Id === id);
    if (index === -1) {
      throw new Error("Blog post not found");
    }
    blogs[index] = { 
      ...blogs[index], 
      ...updates,
      isHtmlContent: updates.isHtmlContent !== undefined ? updates.isHtmlContent : blogs[index].isHtmlContent
    };
    return { ...blogs[index] };
  },

  async delete(id) {
    await delay(250);
    const index = blogs.findIndex(b => b.Id === id);
    if (index === -1) {
      throw new Error("Blog post not found");
    }
    blogs.splice(index, 1);
    return true;
  }
};