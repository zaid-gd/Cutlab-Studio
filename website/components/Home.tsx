"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { MotionConfig, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import InteractiveDashboard from "./InteractiveDashboard";
import ProductStory from "./ProductStory";
import SiteButton from "./SiteButton";

const MagicRings = dynamic(() => import("./react-bits/MagicRings"), {
  ssr: false,
});

function useViewportEntry() {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry?.isIntersecting ?? false);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, isInView] as const;
}

export default function Home() {
  const reduceMotion = useReducedMotion();
  const [ringsRef, ringsInView] = useViewportEntry();

  return (
    <MotionConfig reducedMotion="user">
      <div className="site" id="top">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>

        <header className="site-header" style={{ width: "90vw", height: 68 }}>
          <a className="brand" href="#top" aria-label="Relay home">
            <Image
              src="/brand/relay/lockup-accent.svg"
              width={320}
              height={100}
              alt="Relay"
              priority
            />
          </a>
          <nav className="site-nav" aria-label="Main navigation">
            <a href="#product">Product</a>
            <a href="#pricing">Pricing</a>
            <SiteButton className="nav-action" href="/waitlist">
              Join the waitlist
            </SiteButton>
          </nav>
        </header>

        <main id="main-content">
          <section className="hero" aria-labelledby="hero-title">
            <div ref={ringsRef} className="hero-rings" aria-hidden="true">
              {!reduceMotion && ringsInView && (
                <MagicRings
                  color="#c6ff00"
                  colorTwo="#f4f4f5"
                  ringCount={7}
                  speed={0.58}
                  attenuation={8}
                  lineThickness={2.2}
                  baseRadius={0.28}
                  radiusStep={0.12}
                  scaleRate={0.1}
                  opacity={0.92}
                  noiseAmount={0.025}
                  rotation={-8}
                  ringGap={1.28}
                  fadeIn={0.6}
                  fadeOut={0.7}
                  followMouse
                  mouseInfluence={0.08}
                  hoverScale={1.04}
                  parallax={0.025}
                />
              )}
            </div>

            <div className="hero-message">
              <div className="hero-heading">
                <h1 id="hero-title">
                  <span>Manage editing</span>
                  <span>projects.</span>
                </h1>
              </div>
              <div className="hero-support">
                <p className="hero-copy">
                  Track projects and deadlines, collect client feedback on
                  uploaded videos, and manage delivery in one workspace.
                </p>
                <SiteButton className="hero-action" href="/waitlist">
                  Join the waitlist
                </SiteButton>
                <p className="hero-access-note">
                  Early access. Selected testers receive an email invite.
                </p>
              </div>
            </div>

            <div className="product-reveal" id="product">
              <div className="product-glow">
                <div className="product-frame">
                  <div className="dashboard-crop">
                    <InteractiveDashboard />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ProductStory />
        </main>
      </div>
    </MotionConfig>
  );
}
