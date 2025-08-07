import mockData from "@/services/mockData/videos.json";

let videos = [...mockData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const videoService = {
  async getAll() {
    await delay(300);
    return videos.map(video => ({ ...video }));
  },

  async getById(id) {
    await delay(200);
    const video = videos.find(v => v.Id === id);
    if (!video) {
      throw new Error("Video not found");
    }
    return { ...video };
  },

async create(videoData) {
    await delay(400);
    const newVideo = {
      Id: Math.max(...videos.map(v => v.Id), 0) + 1,
      ...videoData,
      isHtmlDescription: videoData.isHtmlDescription || false,
      createdAt: new Date().toISOString()
    };
    videos.unshift(newVideo);
    return { ...newVideo };
  },

async update(id, updates) {
    await delay(300);
    const index = videos.findIndex(v => v.Id === id);
    if (index === -1) {
      throw new Error("Video not found");
    }
    videos[index] = { 
      ...videos[index], 
      ...updates,
      isHtmlDescription: updates.isHtmlDescription !== undefined ? updates.isHtmlDescription : videos[index].isHtmlDescription
    };
    return { ...videos[index] };
  },

  async delete(id) {
    await delay(250);
    const index = videos.findIndex(v => v.Id === id);
    if (index === -1) {
      throw new Error("Video not found");
    }
    videos.splice(index, 1);
    return true;
  }
};