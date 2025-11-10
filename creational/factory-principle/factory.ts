interface Transport {
  deliver(): void;
}

interface TransportFactory {
  createTransport(): Promise<Transport>;
}

class Logististics {
  async deliver(): Promise<void> {
    const transport = await this.createTransport();
    console.log("transport", transport);
    // console.log("Logistics: Transport created.");
    return transport.deliver();
  }
  createTransport(): Promise<Transport> {
    throw new Error("Method not implemented.");
  }

  async planDelivery(): Promise<void> {
    console.log(this);
    return await this.deliver();
  }
}

export { Transport, TransportFactory, Logististics };
