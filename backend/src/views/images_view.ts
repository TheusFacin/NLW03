import Image from '../models/Image'

export default {
  render(image: Image) {
    const { id, path } = image

    return {
      id,
      url: `${process.env.URL}/uploads/${path}`,
    }
  },

  renderMany(images: Image[]) {
    return images.map(this.render)
  },
}
