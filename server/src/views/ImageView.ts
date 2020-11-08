import Image from '../models/Image';

class ImageView {
  render(image: Image) {
    return {
      id: image.id,
      url: `http://192.168.0.11:3333/uploads/${image.path}`,
    };
  }

  renderMany(images: Image[]) {
    return images.map((image) => this.render(image));
  }
}

export default new ImageView();
