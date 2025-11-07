import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image_url?: string;
}

interface PageProps {
    flash: {
        message?: string;
    };
    products: Product[];
}

export default function Index() {
    const { products, flash } = usePage().props as PageProps;
    const { processing, delete: destroy } = useForm();

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete ${id} ${name}?`)) {
            destroy(route('products.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="m-4">
                <Link href={route('products.create')}>
                    <Button>Create a Product</Button>
                </Link>
            </div>
            <div className="m-4">
                <div>
                    {flash.message && (
                        <Alert>
                            <Megaphone className="h-4 w-4" />
                            <AlertTitle>Notification!</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
            {products.length > 0 && (
                <div className="m-4">
                    <Table>
                        <TableCaption>A list of products</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px] text-center">
                                    Image
                                </TableHead>
                                <TableHead className="w-[100px] text-center">
                                    ID
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-center">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="text-center">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="mx-auto h-16 w-16 rounded-md object-cover"
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-400">
                                                No Image
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center font-medium">
                                        {product.id}
                                    </TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>Rp {product.price}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell className="text-center">
                                        <Link
                                            href={route(
                                                'products.edit',
                                                product.id,
                                            )}
                                        >
                                            <Button className="mr-2 bg-yellow-500 hover:bg-yellow-700">
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={() =>
                                                handleDelete(
                                                    product.id,
                                                    product.name,
                                                )
                                            }
                                            className="bg-red-500 hover:bg-red-700"
                                            disabled={processing}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </AppLayout>
    );
}
