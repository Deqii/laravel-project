import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit a Product',
        href: '/products/edit',
    },
];

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image?: string | null;
}

interface Props {
    product: Product;
}

export default function Edit({ product }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        price: product.price,
        description: product.description,
        image: null as File | null,
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('products.update', product.id), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update a Product" />
            <div className="m-4">
                <form onSubmit={handleUpdate} className="space-y-4">
                    {/* Display error */}
                    {Object.keys(errors).length > 0 && (
                        <Alert>
                            <CircleAlert className="h-4 w-4" />
                            <AlertTitle>Errors!</AlertTitle>
                            <AlertDescription>
                                <ul>
                                    {Object.entries(errors).map(
                                        ([Key, message]) => (
                                            <li key={Key}>
                                                {message as string}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Product Name */}
                    <div className="gap-1.5">
                        <Label htmlFor="product name">Name</Label>
                        <Input
                            placeholder="Product Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        ></Input>
                    </div>

                    {/* Product Price */}
                    <div className="gap-1.5">
                        <Label htmlFor="product price">Price</Label>
                        <Input
                            type="number"
                            placeholder="Price"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                        ></Input>
                    </div>

                    {/* Product Description */}
                    <div className="gap-1.5">
                        <Label htmlFor="product description">Description</Label>
                        <Textarea
                            placeholder="Description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        ></Textarea>
                    </div>

                    {/* Current Image */}
                    {product.image && (
                        <div>
                            <Label>Current Image</Label>
                            <div className="mt-2">
                                <img
                                    src={`/storage/${product.image}`}
                                    alt={product.name}
                                    className="h-40 w-40 rounded-lg object-cover shadow"
                                />
                            </div>
                        </div>
                    )}

                    {/* New Image Upload */}
                    <div className="gap-1.5">
                        <Label htmlFor="product-image">Change Image</Label>
                        <Input
                            id="product-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setData('image', e.target.files?.[0] ?? null)
                            }
                        />
                    </div>

                    <Button disabled={processing} type="submit">
                        Update Product
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
