  
import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';

export default class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const order = this.ormRepository.create({
      customer,
    });

    const orderProducts = products.map(product => {
      const orderProduct = new OrdersProducts();
      Object.assign(orderProduct, {
        price: product.price,
        product_id: product.product_id,
        quantity: product.quantity,
      });

      return orderProduct;
    });

    Object.assign(order, {
      order_products: orderProducts,
    });

    await this.ormRepository.save(order);

    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    return this.ormRepository.findOne(id);
  }
}