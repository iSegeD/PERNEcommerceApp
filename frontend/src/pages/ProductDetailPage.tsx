import { Link } from 'react-router';
import { ProductPageSkeleton } from '../components/LoadingSkeletons';
import PageError from '../components/PageError';
import { useProductPage } from '../hooks/useProductPage';
import {
  IK_PRESETS,
  imageKitOptimizedUrl,
  imageKitWatermarkedUrl,
} from '../lib/imageKitUrl';
import { useCart } from '../store/cart';
import {
  ArrowLeftIcon,
  CheckIcon,
  ExternalLinkIcon,
  ShoppingCartIcon,
} from 'lucide-react';
import { formatPrice } from '../utils/format';

const HIGHLIGHTS = [
  'Secure checkout',
  'Support from your order after payment',
  'Specs listed for this calalog',
] as const;

const ProductDetailPage = () => {
  const addItem = useCart((state) => state.addItem);
  const { product, isLoading, error } = useProductPage();

  if (isLoading) return <ProductPageSkeleton />;

  if (error || !product) {
    return (
      <PageError
        message='Product not found'
        action={{ to: '/', label: 'Back to shop' }}
      />
    );
  }

  const category = product.category ?? 'All';

  const watermarkedFullUrl = product.imageUrl
    ? imageKitWatermarkedUrl(product.imageUrl, IK_PRESETS.productHero)
    : null;

  return (
    <div>
      <nav className='breadcrumbs text-sm text-base-content/60'>
        <ul>
          <li>
            <Link to='/'>Shop</Link>
          </li>
          <li>
            <Link to={`/?category=${encodeURIComponent(category)}`}>
              {category}
            </Link>
          </li>
          <li className='text-base-content'>{product.name}</li>
        </ul>
      </nav>

      <div className='mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14'>
        <div className='card overflow-hidden border border-base-300 bg-base-100 shadow-lg'>
          <figure className='aspect-square bg-base-300'>
            {product.imageUrl ? (
              <img
                src={imageKitOptimizedUrl(
                  product.imageUrl,
                  IK_PRESETS.productHero,
                )}
                alt=''
                className='h-full w-full object-cover'
                fetchPriority='high'
                decoding='async'
              />
            ) : (
              <div className='h-full w-full' />
            )}
          </figure>

          {watermarkedFullUrl ? (
            <div className='flex flex-wrap items-center gap-2 border-t border-base-300 bg-base-200/40 px-3 py-3'>
              <a
                href={watermarkedFullUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='btn btn-ghost btn-xs gap-1'
              >
                <ExternalLinkIcon className='size-3.5' aria-hidden />
                Open full size
              </a>
            </div>
          ) : null}
        </div>

        <div className='flex flex-col text-left'>
          <div className='flex felx-wrap items-center gap-2'>
            <span className='badge badge-primary badge-outline'>
              {category}
            </span>
            <span className='text-xs font-mono text-base-content/45'>
              {product.slug}
            </span>
          </div>
          <h1 className='mt-3 text-3xl font-bold tracking-tight text-base-content md:text-4xl'>
            {product.name}
          </h1>
          <p className='mt-3 text-3xl font-bold tabular-nums text-primary md:text-3xl'>
            {formatPrice(product.priceCents, product.currency)}
          </p>

          <p className='mt-6 text-base leading-relaxed text-base-content/85'>
            {product.description}
          </p>

          <ul className='mt-6 space-y-2 rounded-box border border-base-300 ng-base-200/50 p-4'>
            {HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className='flex items-center gap-2 text-sm text-base-content/80'
              >
                <CheckIcon
                  className='size-4 shrink-0 text-success'
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>

          <div className='mt-8 flex flex-wrap gap-3'>
            <button
              type='button'
              onClick={() => addItem(product.id)}
              className='btn btn-primary btn-lg gap-2 shadow-lg'
            >
              <ShoppingCartIcon className='size-5' aria-hidden />
              Add to cart
            </button>
            <Link
              to='/'
              className='btn btn-ghost btn-lg gap-2 border border-base-300'
            >
              <ArrowLeftIcon className='size-4' aria-hidden />
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
