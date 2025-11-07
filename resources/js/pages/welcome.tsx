import { Button } from '@/components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCircle, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image_url?: string;
}

interface PageProps {
    products: Product[];
    auth: { user?: any };
    filters: { search?: string };
}

export default function Welcome() {
    const { auth, products, filters } = usePage<PageProps>().props;
    const [cartCount, setCartCount] = useState<number>(0);
    const [toast, setToast] = useState<string | null>(null);

    const fetchCartCount = async () => {
        if (!auth.user) return;
        const response = await fetch(route('cart.count'));
        const data = await response.json();
        setCartCount(data.count);
    };

    useEffect(() => {
        fetchCartCount();
    }, []);

    const handleAddToCart = async (id: number) => {
        if (!auth.user) {
            alert(
                'Silakan login terlebih dahulu untuk menambahkan ke keranjang.',
            );
            return;
        }

        await router.post(
            route('cart.store'),
            { product_id: id },
            {
                onSuccess: () => {
                    setToast('Produk berhasil ditambahkan ke keranjang!');
                    fetchCartCount();
                    setTimeout(() => setToast(null), 3000);
                },
            },
        );
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = (
            e.currentTarget.elements.namedItem('search') as HTMLInputElement
        ).value;
        router.get('/', { search: query });
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white shadow">
                    <div className="container mx-auto flex items-center justify-between px-6 py-4">
                        <h1 className="text-2xl font-bold text-indigo-600">
                            <Link href={route('home')}>DeqiStore</Link>
                        </h1>
                        <div className="flex items-center gap-6">
                            {auth.user ? (
                                <>
                                    <Link href={route('dashboard')}>
                                        <Button variant="outline">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <div className="relative">
                                        <Link href={route('cart.index')}>
                                            <ShoppingCart className="h-6 w-6 text-gray-700 transition hover:text-indigo-600" />
                                            {cartCount > 0 && (
                                                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')}>
                                        <Button variant="outline">Login</Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button variant="outline">
                                            Register
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Toast Notification */}
                {toast && (
                    <div className="animate-slide-in fixed top-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg">
                        <CheckCircle className="h-5 w-5" />
                        <span>{toast}</span>
                    </div>
                )}

                {/* Hero Section */}
                <section className="bg-gradient-to-r from-indigo-500 to-purple-600 py-20 text-center text-white">
                    <h2 className="mb-3 text-4xl font-extrabold md:text-5xl">
                        Temukan Produk Terbaik untuk Kebutuhanmu!
                    </h2>
                    <p className="mb-6 text-lg opacity-90">
                        Belanja mudah, cepat, dan aman di DeqiStore.
                    </p>
                    <a
                        href="#products"
                        className="rounded-full bg-white px-6 py-3 font-semibold text-indigo-600 shadow hover:bg-gray-100"
                    >
                        Lihat Produk
                    </a>
                </section>

                {/* Search */}
                <section className="container mx-auto px-6 py-10">
                    <form
                        onSubmit={handleSearch}
                        className="flex justify-center"
                    >
                        <input
                            type="text"
                            name="search"
                            defaultValue={filters.search || ''}
                            placeholder="Cari produk..."
                            className="w-1/2 rounded-l-lg border border-gray-300 px-4 py-2 text-black focus:border-indigo-500 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="rounded-r-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                        >
                            Cari
                        </button>
                    </form>
                </section>

                {/* Product Grid */}
                <section id="products" className="container mx-auto px-6 py-12">
                    <h3 className="mb-8 text-center text-3xl font-bold text-gray-800">
                        Produk Unggulan
                    </h3>
                    {products.length === 0 ? (
                        <p className="text-center text-gray-500">
                            Belum ada produk yang tersedia.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg"
                                >
                                    <img
                                        src={
                                            product.image_url ||
                                            '/placeholder.png'
                                        }
                                        alt={product.name}
                                        className="h-48 w-full object-cover"
                                    />
                                    <div className="p-4">
                                        <h4 className="text-lg font-semibold text-gray-800">
                                            {product.name}
                                        </h4>
                                        <p className="mb-2 line-clamp-2 text-sm text-gray-500">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-indigo-600">
                                                Rp{' '}
                                                {product.price.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </span>
                                            <Button
                                                onClick={() =>
                                                    handleAddToCart(product.id)
                                                }
                                                className="bg-indigo-600 text-sm hover:bg-indigo-700"
                                            >
                                                Tambah
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Footer */}
                <footer className="mt-12 bg-gray-900 py-6 text-center text-gray-400">
                    © 2025 DeqiStore. All rights reserved.
                </footer>
            </div>
        </>
    );
}
