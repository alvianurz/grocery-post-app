// Utility function for Bluetooth thermal printing
// This is a simplified implementation that would need to be expanded in a real application

interface PrinterOptions {
  deviceName?: string;
  width?: number;
}

interface PrintJob {
  text: string;
  bold?: boolean;
  align?: 'left' | 'center' | 'right';
  size?: 'normal' | 'double-width' | 'double-height' | 'double';
}

export class BluetoothPrinter {
  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private options: PrinterOptions;

  constructor(options: PrinterOptions = {}) {
    this.options = {
      width: 32, // Default 32 characters per line for 58mm printers
      ...options
    };
  }

  // Connect to a Bluetooth printer
  async connect(): Promise<boolean> {
    try {
      // Request a Bluetooth device
      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          { name: this.options.deviceName || 'Printer' },
          { services: ['000018f0-0000-1000-8000-00805f9b34fb'] } // Common printer service
        ],
        optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
      });

      // Connect to the GATT server
      this.server = await this.device.gatt?.connect() || null;

      if (!this.server) {
        throw new Error('Failed to connect to GATT server');
      }

      // Get the primary service
      const service = await this.server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');

      // Get the characteristic for writing
      this.characteristic = await service.getCharacteristic('00002af0-0000-1000-8000-00805f9b34fb');

      return true;
    } catch (error) {
      console.error('Failed to connect to printer:', error);
      return false;
    }
  }

  // Disconnect from the printer
  async disconnect(): Promise<void> {
    if (this.characteristic) {
      this.characteristic = null;
    }
    if (this.server) {
      await this.server.disconnect();
      this.server = null;
    }
    if (this.device) {
      this.device = null;
    }
  }

  // Send raw data to the printer
  private async sendRaw(data: Uint8Array): Promise<void> {
    if (!this.characteristic) {
      throw new Error('Not connected to printer');
    }
    await this.characteristic.writeValueWithoutResponse(data);
  }

  // Send text to the printer
  private async sendText(text: string): Promise<void> {
    const encoder = new TextEncoder();
    await this.sendRaw(encoder.encode(text));
  }

  // Send ESC/POS commands
  private async sendCommand(command: number[]): Promise<void> {
    const data = new Uint8Array(command);
    await this.sendRaw(data);
  }

  // Print a line of text
  async printLine(text: string, options: { bold?: boolean; align?: 'left' | 'center' | 'right' } = {}): Promise<void> {
    // Apply formatting
    if (options.bold) {
      await this.sendCommand([0x1B, 0x45, 0x01]); // Bold on
    }

    // Apply alignment
    if (options.align) {
      const alignCommands = {
        left: [0x1B, 0x61, 0x00],
        center: [0x1B, 0x61, 0x01],
        right: [0x1B, 0x61, 0x02]
      };
      await this.sendCommand(alignCommands[options.align]);
    }

    // Send text
    await this.sendText(text + '\n');

    // Reset formatting
    if (options.bold) {
      await this.sendCommand([0x1B, 0x45, 0x00]); // Bold off
    }
    if (options.align) {
      await this.sendCommand([0x1B, 0x61, 0x00]); // Align left
    }
  }

  // Print a full receipt
  async printReceipt(receiptData: {
    storeName: string;
    storePhone: string;
    orderId: number;
    orderDate: string;
    customerName: string;
    customerPhone: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
  }): Promise<boolean> {
    try {
      // Initialize printer
      await this.sendCommand([0x1B, 0x40]); // Initialize printer

      // Print header
      await this.printLine(receiptData.storeName, { bold: true, align: 'center' });
      await this.printLine(`Phone: ${receiptData.storePhone}`, { align: 'center' });
      await this.printLine('', {}); // Empty line

      // Print order details
      await this.printLine('ORDER RECEIPT', { bold: true, align: 'center' });
      await this.printLine('', {}); // Empty line
      await this.printLine(`Order ID: #${receiptData.orderId}`, {});
      await this.printLine(`Date: ${receiptData.orderDate}`, {});
      await this.printLine('', {}); // Empty line

      // Print customer info
      await this.printLine('CUSTOMER', { bold: true });
      await this.printLine(`Name: ${receiptData.customerName}`, {});
      await this.printLine(`Phone: ${receiptData.customerPhone}`, {});
      await this.printLine('', {}); // Empty line

      // Print items
      await this.printLine('ITEMS', { bold: true });
      for (const item of receiptData.items) {
        const itemLine = `${item.quantity} x ${item.name}`;
        await this.printLine(itemLine, {});
        const priceLine = `     ${item.quantity} @ $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`;
        await this.printLine(priceLine, {});
      }
      await this.printLine('', {}); // Empty line

      // Print total
      await this.printLine('TOTAL', { bold: true });
      await this.printLine(`$${receiptData.total.toFixed(2)}`, { bold: true, align: 'right' });
      await this.printLine('', {}); // Empty line

      // Print footer
      await this.printLine('Thank you for your order!', { align: 'center' });
      await this.printLine('Please come again!', { align: 'center' });

      // Cut paper
      await this.sendCommand([0x1D, 0x56, 0x00]); // Full cut

      return true;
    } catch (error) {
      console.error('Failed to print receipt:', error);
      return false;
    }
  }
}

// Check if Web Bluetooth is supported
export function isWebBluetoothSupported(): boolean {
  return navigator.bluetooth !== undefined;
}

// Get available Bluetooth devices (requires user interaction)
export async function requestBluetoothPrinter(): Promise<BluetoothDevice | null> {
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { services: ['000018f0-0000-1000-8000-00805f9b34fb'] }
      ]
    });
    return device;
  } catch (error) {
    console.error('Failed to request Bluetooth device:', error);
    return null;
  }
}