import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';
import { route } from 'ziggy-js';

interface CartItem {
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
    cartItems: CartItem[];
    total: number;
    flash?: { message?: string };
}

export default function CartIndex() {
    const { cartItems, total, flash } = usePage<PageProps>().props;

    const handleDelete = (id: number) => {
        if (confirm('Hapus produk ini dari keranjang?')) {
            router.delete(route('cart.destroy', id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Keranjang Belanja" />
            <header className="bg-white shadow">
                <div className="container mx-auto flex items-center justify-between px-6 py-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Keranjang Belanja
                    </h1>
                    <Link
                        href={route('home')}
                        className="text-indigo-600 hover:underline"
                    >
                        Kembali ke Beranda
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-6 py-10">
                {flash?.message && (
                    <Alert className="mb-6">
                        <Megaphone className="h-4 w-4" />
                        <AlertTitle>Notifikasi</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}

                {cartItems.length === 0 ? (
                    <p className="text-center text-gray-500">
                        Keranjang kamu masih kosong.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
                            >
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={
                                            item.product.image_url ||
                                            '/placeholder.png'
                                        }
                                        alt={item.product.name}
                                        className="h-20 w-20 rounded object-cover"
                                    />
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            {item.product.name}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Jumlah: {item.quantity}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-indigo-600">
                                        Rp{' '}
                                        {(
                                            item.product.price * item.quantity
                                        ).toLocaleString('id-ID')}
                                    </p>
                                    <Button
                                        onClick={() => handleDelete(item.id)}
                                        className="mt-2 bg-red-500 hover:bg-red-700"
                                    >
                                        Hapus
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <div className="mt-6 flex justify-between border-t pt-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Total:
                            </h3>
                            <span className="text-xl font-bold text-indigo-600">
                                Rp {total.toLocaleString('id-ID')}
                            </span>
                        </div>
                        <div className="flex justify-end">
                            <Link href={route('checkout.index')}>
                                <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">
                                    Lanjut ke Checkout
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
