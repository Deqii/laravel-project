import { Button } from '@/components/ui/button';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface CheckoutItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        image_url?: string;
    };
}

interface PageProps {
    cartItems: CheckoutItem[];
    total: number;
}

export default function CheckoutIndex() {
    const { cartItems, total } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Checkout" />
            <header className="bg-white shadow">
                <div className="container mx-auto flex items-center justify-between px-6 py-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Checkout
                    </h1>
                    <Link
                        href={route('cart.index')}
                        className="text-indigo-600 hover:underline"
                    >
                        Kembali ke Keranjang
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-6 py-10">
                <h2 className="mb-6 text-2xl font-semibold text-gray-800">
                    Ringkasan Pesanan
                </h2>

                <div className="rounded-lg bg-white p-6 shadow">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between border-b py-3"
                        >
                            <div className="flex items-center space-x-4">
                                <img
                                    src={
                                        item.product.image_url ||
                                        '/placeholder.png'
                                    }
                                    alt={item.product.name}
                                    className="h-16 w-16 rounded object-cover"
                                />
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800">
                                        {item.product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Jumlah: {item.quantity}
                                    </p>
                                </div>
                            </div>
                            <span className="font-semibold text-indigo-600">
                                Rp{' '}
                                {(
                                    item.product.price * item.quantity
                                ).toLocaleString('id-ID')}
                            </span>
                        </div>
                    ))}
                    <div className="mt-6 flex justify-between text-lg font-semibold">
                        <span>Total Pembayaran:</span>
                        <span className="text-indigo-600">
                            Rp {total.toLocaleString('id-ID')}
                        </span>
                    </div>
                    <div className="mt-6 text-center">
                        <Button className="bg-green-600 hover:bg-green-700">
                            Konfirmasi & Bayar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
