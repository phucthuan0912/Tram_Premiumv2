import React, { useEffect, useRef, useState } from 'react';
import { usePageTransition } from '../context/PageTransitionContext';

const SharedElementTransition = () => {
    const { transitionData, clearTransition } = usePageTransition();
    const [phase, setPhase] = useState('idle'); // idle | flying | landing | done
    const overlayRef = useRef(null);
    const imageRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        if (!transitionData) {
            setPhase('idle');
            return;
        }

        setPhase('flying');

        // Wait for the target Product page to mount and render its main image
        const pollForTarget = () => {
            const targetEl = document.querySelector('[data-transition-target="product-image"]');
            if (targetEl) {
                animateToTarget(targetEl);
            } else {
                rafRef.current = requestAnimationFrame(pollForTarget);
            }
        };

        // Small initial delay so browser can paint the overlay first
        const startTimer = setTimeout(() => {
            rafRef.current = requestAnimationFrame(pollForTarget);
        }, 30);

        // Safety timeout - if we can't find target in 1.2s, just finish
        const safetyTimer = setTimeout(() => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            setPhase('done');
            setTimeout(clearTransition, 100);
        }, 1200);

        return () => {
            clearTimeout(startTimer);
            clearTimeout(safetyTimer);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transitionData]);

    const animateToTarget = (targetEl) => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (!imageRef.current || !transitionData) return;

        const targetRect = targetEl.getBoundingClientRect();
        const shell = imageRef.current;
        const src = transitionData.sourceRect;

        // Calculate the transform from source position to target position
        const deltaX = targetRect.left + targetRect.width / 2 - (src.left + src.width / 2);
        const deltaY = targetRect.top + targetRect.height / 2 - (src.top + src.height / 2);
        const scaleX = targetRect.width / src.width;
        const scaleY = targetRect.height / src.height;
        const scale = Math.max(scaleX, scaleY);

        // Create the flight animation with arc
        const arcHeight = Math.min(60, Math.abs(deltaY) * 0.08 + 20);

        const animation = shell.animate(
            [
                {
                    transform: 'translate3d(0, 0, 0) scale(1)',
                    borderRadius: '12px',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.15)',
                    opacity: 1,
                },
                {
                    transform: `translate3d(${deltaX * 0.4}px, ${deltaY * 0.3 - arcHeight}px, 0) scale(${1 + (scale - 1) * 0.3})`,
                    borderRadius: '16px',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.3), 0 0 40px rgba(99,102,241,0.15)',
                    opacity: 1,
                    offset: 0.4,
                },
                {
                    transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale})`,
                    borderRadius: '16px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    opacity: 1,
                },
            ],
            {
                duration: 580,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                fill: 'forwards',
            },
        );

        // Animate the sparkle trail
        createSparkleTrail(src, targetRect, deltaX, deltaY);

        // Fade in the page content during landing
        setPhase('landing');

        animation.addEventListener('finish', () => {
            setPhase('done');
            setTimeout(() => {
                clearTransition();
            }, 80);
        }, { once: true });
    };

    const createSparkleTrail = (srcRect, targetRect, deltaX, deltaY) => {
        const container = overlayRef.current;
        if (!container) return;

        const startX = srcRect.left + srcRect.width / 2;
        const startY = srcRect.top + srcRect.height / 2;

        // Create 8 sparkle particles
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            const size = 3 + Math.random() * 5;
            const delay = i * 45;
            const offsetX = (Math.random() - 0.5) * 60;
            const offsetY = (Math.random() - 0.5) * 60;
            const progress = 0.1 + (i / 8) * 0.6;

            Object.assign(particle.style, {
                position: 'fixed',
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                background: i % 2 === 0
                    ? 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(99,102,241,0.6))'
                    : 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(234,179,8,0.5))',
                boxShadow: `0 0 ${size * 2}px ${i % 2 === 0 ? 'rgba(99,102,241,0.4)' : 'rgba(234,179,8,0.3)'}`,
                left: `${startX + deltaX * progress + offsetX}px`,
                top: `${startY + deltaY * progress + offsetY}px`,
                pointerEvents: 'none',
                zIndex: '10001',
            });

            container.appendChild(particle);

            particle.animate(
                [
                    { transform: 'scale(0) translateY(0)', opacity: 0 },
                    { transform: 'scale(1.2) translateY(-8px)', opacity: 1, offset: 0.3 },
                    { transform: 'scale(0) translateY(-20px)', opacity: 0 },
                ],
                {
                    duration: 500,
                    delay,
                    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    fill: 'forwards',
                },
            ).addEventListener('finish', () => {
                if (particle.parentNode) particle.parentNode.removeChild(particle);
            }, { once: true });
        }
    };

    if (!transitionData || phase === 'idle') return null;

    const { sourceRect, imageSrc } = transitionData;

    return (
        <div
            ref={overlayRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                pointerEvents: 'none',
            }}
        >
            {/* Subtle backdrop during flight */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.06) 0%, transparent 70%)',
                    opacity: phase === 'flying' || phase === 'landing' ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                }}
            />

            {/* The flying image clone */}
            {phase !== 'done' && (
                <div
                    ref={imageRef}
                    style={{
                        position: 'fixed',
                        top: sourceRect.top,
                        left: sourceRect.left,
                        width: sourceRect.width,
                        height: sourceRect.height,
                        overflow: 'hidden',
                        borderRadius: '12px',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.15)',
                        willChange: 'transform, opacity',
                    }}
                >
                    <img
                        src={imageSrc}
                        alt=""
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                        }}
                    />
                    {/* Glowing edge effect */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: 'inherit',
                            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)',
                            pointerEvents: 'none',
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default SharedElementTransition;
