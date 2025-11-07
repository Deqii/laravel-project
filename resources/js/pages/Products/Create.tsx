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
        title: 'Create a New Product',
        href: '/products/create',
    },
];

export default function Index() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        description: '',
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('products.store'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create a New Product" />
            <div className="m-4">
                <form onSubmit={handleSubmit} className="space-y-4">
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

                    {/* Product Image */}
                    <div className="gap-1.5">
                        <Label htmlFor="product-image">Image</Label>
                        <Input
                            id="product-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setData('image', e.target.files?.[0] ?? null)
                            }
                        />
                    </div>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Processing...' : 'Add Product'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
