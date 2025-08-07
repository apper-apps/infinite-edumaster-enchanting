import mockData from "@/services/mockData/testimonials.json";

let testimonials = [...mockData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const testimonialService = {
  async getAll() {
    await delay(300);
    return testimonials.map(testimonial => ({ ...testimonial }));
  },

  async getById(id) {
    await delay(200);
    const testimonial = testimonials.find(t => t.Id === id);
    if (!testimonial) {
      throw new Error("Testimonial not found");
    }
    return { ...testimonial };
  },

  async create(testimonialData) {
    await delay(400);
    const newTestimonial = {
      Id: Math.max(...testimonials.map(t => t.Id), 0) + 1,
      ...testimonialData,
      createdAt: new Date().toISOString()
    };
    testimonials.unshift(newTestimonial);
    return { ...newTestimonial };
  },

  async update(id, updates) {
    await delay(300);
    const index = testimonials.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Testimonial not found");
    }
    testimonials[index] = { ...testimonials[index], ...updates };
    return { ...testimonials[index] };
  },

  async delete(id) {
    await delay(250);
    const index = testimonials.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Testimonial not found");
    }
    testimonials.splice(index, 1);
    return true;
  }
};