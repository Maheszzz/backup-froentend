import { useMemo, useState } from 'react';
import { Star, MessageSquare, User, Send, BadgeCheck, Wifi, Utensils, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import type { Review } from '@/types/api';
import { api } from '@/lib/api/client';

interface ReviewSectionProps {
    propertyId: string | number;
    initialReviews: Review[];
    onReviewAdded?: () => void;
}

function ratingDistribution(reviews: Review[]) {
    const dist = [0, 0, 0, 0, 0];
    for (const r of reviews) {
        const i = Math.min(5, Math.max(1, r.rating)) - 1;
        dist[i] += 1;
    }
    return dist;
}

function SubRatingRow({ label, value, icon: Icon }: { label: string; value?: number; icon: typeof Wifi }) {
    if (!value) return null;
    return (
        <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
                <Icon className="w-3.5 h-3.5 text-slate-400" aria-hidden />
                {label}
            </span>
            <span className="font-bold text-slate-800">{value}/5</span>
        </div>
    );
}

export function ReviewSection({ propertyId, initialReviews, onReviewAdded }: ReviewSectionProps) {
    const approved = useMemo(
        () => initialReviews.filter((r) => !r.status || r.status === 'approved'),
        [initialReviews],
    );
    const [reviews, setReviews] = useState<Review[]>(approved);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [userName, setUserName] = useState('');
    const [comment, setComment] = useState('');
    const [cleanliness, setCleanliness] = useState(0);
    const [wifi, setWifi] = useState(0);
    const [food, setFood] = useState(0);
    const [safety, setSafety] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pendingMsg, setPendingMsg] = useState<string | null>(null);

    const avg =
        reviews.length > 0
            ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
            : null;
    const dist = useMemo(() => ratingDistribution(reviews), [reviews]);
    const maxDist = Math.max(...dist, 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (!userName.trim()) {
            setError('Please enter your name');
            return;
        }

        setSubmitting(true);
        setError(null);
        setPendingMsg(null);

        try {
            await api.post<Review>(`/realty/properties/${propertyId}/reviews`, {
                rating,
                user_name: userName.trim(),
                review_text: comment.trim() || undefined,
                cleanliness_rating: cleanliness || undefined,
                wifi_rating: wifi || undefined,
                food_rating: food || undefined,
                safety_rating: safety || undefined,
            });
            setPendingMsg(
                'Thank you! Your review is pending verification and will appear after our team approves it.',
            );
            setRating(0);
            setUserName('');
            setComment('');
            setCleanliness(0);
            setWifi(0);
            setFood(0);
            setSafety(0);
            if (onReviewAdded) onReviewAdded();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to submit review';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    const miniStars = (value: number, setValue: (n: number) => void, label: string) => (
        <div>
            <p className="text-xs font-semibold text-slate-600 mb-1">{label}</p>
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setValue(s)}
                        className="focus:outline-none"
                        aria-label={`${label} ${s} stars`}
                    >
                        <Star
                            className={`w-5 h-5 ${value >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 border-l-4 border-brand-red pl-4">
                        Reviews &amp; ratings
                    </h3>
                    {avg && (
                        <p className="mt-2 pl-5 text-sm text-slate-600">
                            <span className="font-bold text-slate-900 text-lg">{avg}</span> out of 5 ·{' '}
                            {reviews.length} verified tenant review{reviews.length === 1 ? '' : 's'}
                        </p>
                    )}
                </div>
                {reviews.length > 0 && (
                    <div className="lg:w-64 space-y-2 shrink-0">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = dist[star - 1];
                            const pct = Math.round((count / maxDist) * 100);
                            return (
                                <div key={star} className="flex items-center gap-2 text-xs">
                                    <span className="w-8 font-semibold text-slate-600">{star}★</span>
                                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                                        <div
                                            className="h-full bg-amber-400 rounded-full transition-all"
                                            style={{ width: `${count ? pct : 0}%` }}
                                        />
                                    </div>
                                    <span className="w-6 text-slate-400 text-right">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-white shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-brand-red" />
                    Share your experience
                </h4>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Overall rating</label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="focus:outline-none transition-transform hover:scale-125 duration-200"
                                >
                                    <Star
                                        className={`w-8 h-8 ${
                                            (hoverRating || rating) >= star
                                                ? 'text-amber-400 fill-amber-400'
                                                : 'text-slate-300'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {miniStars(cleanliness, setCleanliness, 'Cleanliness')}
                        {miniStars(wifi, setWifi, 'WiFi')}
                        {miniStars(food, setFood, 'Food')}
                        {miniStars(safety, setSafety, 'Safety')}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="user_name" className="block text-sm font-semibold text-slate-700">
                            Your name
                        </label>
                        <div className="relative max-w-md">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                id="user_name"
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="e.g. Priya Sharma"
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="comment" className="block text-sm font-semibold text-slate-700">
                            Your review
                        </label>
                        <textarea
                            id="comment"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="How was move-in, meals, WiFi, and safety?"
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none font-medium resize-none"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                    {pendingMsg && <p className="text-emerald-700 text-sm font-medium">{pendingMsg}</p>}

                    <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold flex items-center"
                    >
                        {submitting ? 'Submitting...' : (
                            <>
                                Post review <Send className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                </form>
            </div>

            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                        <Star className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-medium">No reviews yet. Be the first to review!</p>
                    </div>
                ) : (
                    reviews.map((review) => {
                        const body = review.comment ?? review.review_text;
                        return (
                            <article
                                key={review.id}
                                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                                itemScope
                                itemType="https://schema.org/Review"
                            >
                                <div className="flex justify-between items-start gap-4 mb-4">
                                    <div className="flex items-center min-w-0">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold text-lg mr-4 border-2 border-white shadow-sm shrink-0">
                                            {review.user_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h5 className="font-bold text-slate-900" itemProp="author">
                                                    {review.user_name}
                                                </h5>
                                                {review.verified_stay && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                                                        <BadgeCheck className="w-3 h-3" aria-hidden />
                                                        Verified tenant
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 font-medium">
                                                {new Date(review.created_at).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0" aria-label={`${review.rating} out of 5`}>
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                className={`w-4 h-4 ${
                                                    review.rating >= s
                                                        ? 'text-amber-400 fill-amber-400'
                                                        : 'text-slate-200'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="pl-0 sm:pl-16 space-y-3">
                                    {(review.cleanliness_rating ||
                                        review.wifi_rating ||
                                        review.food_rating ||
                                        review.safety_rating) && (
                                        <div className="grid sm:grid-cols-2 gap-2 max-w-md rounded-xl bg-slate-50 p-3 border border-slate-100">
                                            <SubRatingRow
                                                label="Cleanliness"
                                                value={review.cleanliness_rating}
                                                icon={Sparkles}
                                            />
                                            <SubRatingRow label="WiFi" value={review.wifi_rating} icon={Wifi} />
                                            <SubRatingRow label="Food" value={review.food_rating} icon={Utensils} />
                                            <SubRatingRow label="Safety" value={review.safety_rating} icon={Shield} />
                                        </div>
                                    )}
                                    {body && (
                                        <p className="text-slate-600 leading-relaxed font-medium" itemProp="reviewBody">
                                            {body}
                                        </p>
                                    )}
                                    {review.review_images && review.review_images.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {review.review_images.map((url) => (
                                                <div
                                                    key={url}
                                                    className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200"
                                                >
                                                    <OptimizedImage
                                                        src={url}
                                                        alt="Tenant photo"
                                                        fill
                                                        size="thumb"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {review.owner_response && (
                                        <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                                Owner response
                                            </p>
                                            {review.owner_response}
                                        </div>
                                    )}
                                </div>
                            </article>
                        );
                    })
                )}
            </div>
        </div>
    );
}
