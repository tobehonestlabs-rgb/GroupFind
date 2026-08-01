// components/Header.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { supabaseClient } from '../lib/supabase';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const authMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (authMenuRef.current && !authMenuRef.current.contains(event.target as Node)) {
        setAuthMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    setUser(null);
    setAuthMenuOpen(false);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Header Mobile */}
      <header className="header-mobile">
        <nav className="header-mobile__nav">
          <div className="header-mobile__logo">
            <Link href="/" aria-label="Accueil">
              <svg className="header-mobile__logo-icon" viewBox="0 0 1170 335" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_mobile" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="465" height="335">
                  <path d="M464.793 0H0V334.254H464.793V0Z" fill="white"/>
                </mask>
                <g mask="url(#mask0_mobile)">
                  <g filter="url(#filter0_diin_mobile)">
                    <mask id="mask1_mobile" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="207" y="81" width="180" height="180">
                      <path d="M346.975 81.4358H247.176C225.399 81.4358 207.745 99.0897 207.745 120.867V220.665C207.745 242.442 225.399 260.096 247.176 260.096H346.975C368.752 260.096 386.405 242.442 386.405 220.665V120.867C386.405 99.0897 368.752 81.4358 346.975 81.4358Z" fill="#14272C"/>
                    </mask>
                    <g mask="url(#mask1_mobile)">
                      <path d="M346.975 81.4358H247.176C225.399 81.4358 207.745 99.0897 207.745 120.867V220.665C207.745 242.442 225.399 260.096 247.176 260.096H346.975C368.752 260.096 386.405 242.442 386.405 220.665V120.867C386.405 99.0897 368.752 81.4358 346.975 81.4358Z" fill="#1F1F1F"/>
                      <g filter="url(#filter1_d_mobile)">
                        <path d="M352.576 144.678L345.544 146.287L320.907 151.919L337.286 135.647L344.356 128.617L348.27 124.722H346.603L317.413 124.7L306.429 135.617L287.789 135.602L276.782 124.669L248.404 124.647H245.887L251.77 130.489L256.886 135.58L272.98 151.573L248.615 146.009L241.582 144.399L233.505 142.557L234.85 144.685L250.05 168.671L265.166 172.123L275.152 187.875L271.808 203.004L287.435 227.666L288.33 229.079L289.517 223.688L291.666 213.951L297.045 189.582L302.485 214.222L304.634 223.959L305.821 229.35L306.715 227.937L322.342 203.274L318.999 188.146L328.984 172.393L344.101 168.942L359.3 144.956L360.645 142.828L352.568 144.67L352.576 144.678ZM297.165 181.792L297.105 181.694L297.413 181.401L297.165 181.792ZM296.902 177.754C288.48 177.754 281.651 170.919 281.651 162.491C281.651 154.062 288.48 147.227 296.902 147.227C305.325 147.227 312.154 154.062 312.154 162.491C312.154 170.919 305.325 177.754 296.902 177.754Z" fill="url(#paint0_linear_mobile)" fillOpacity="0.07"/>
                      </g>
                      <g opacity="0.4" filter="url(#filter2_f_mobile)">
                        <path d="M381.346 121.913C381.346 102.547 369.423 96.4989 366.69 93.4744C368.667 98.069 374.541 112.318 374.541 121.913V214.559C374.541 224.469 371.168 241.486 370.005 246.488C371.924 243.405 381.346 237.589 381.346 214.559V121.913Z" fill="white"/>
                      </g>
                      <g opacity="0.8" filter="url(#filter3_f_mobile)">
                        <path d="M246.478 86.4957C236.987 86.4957 228.566 91.9626 225.541 94.6958C230.136 92.7187 237.231 88.7637 246.478 88.7637H339.123C349.033 88.7637 361.514 91.0899 366.516 92.253C363.433 90.3342 353.639 86.4957 339.123 86.4957H246.478Z" fill="white"/>
                      </g>
                    </g>
                  </g>
                  <path d="M386.405 0.831024V333.223" stroke="url(#paint1_linear_mobile)" strokeWidth="1.66196" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.82 5.82"/>
                  <path opacity="0.3" d="M368.124 104.704L285.857 186.228" stroke="url(#paint2_linear_mobile)" strokeWidth="0.830982" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.63 5.63"/>
                  <path opacity="0.3" d="M338.208 104.704L255.941 186.228" stroke="url(#paint3_linear_mobile)" strokeWidth="0.830982" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.63 5.63"/>
                  <path opacity="0.3" d="M314.47 273.15L291.674 159.597" stroke="url(#paint4_linear_mobile)" strokeWidth="0.830977" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.63 5.63"/>
                  <path opacity="0.3" d="M330.932 248.172L308.137 134.619" stroke="url(#paint5_linear_mobile)" strokeWidth="0.830977" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.63 5.63"/>
                  <path opacity="0.3" d="M207.745 140.435L322.025 159.256" stroke="url(#paint6_linear_mobile)" strokeWidth="0.830982" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.63 5.63"/>
                  <path opacity="0.3" d="M225.289 164.666L339.569 183.487" stroke="url(#paint7_linear_mobile)" strokeWidth="0.830982" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.63 5.63"/>
                  <path d="M207.745 0.831024V333.223" stroke="url(#paint8_linear_mobile)" strokeWidth="1.66196" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.82 5.82"/>
                  <path d="M1.66187 81.4358H463.687" stroke="url(#paint9_linear_mobile)" strokeWidth="1.66196" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.82 5.82"/>
                  <path d="M0.830811 255.942H462.855" stroke="url(#paint10_linear_mobile)" strokeWidth="1.66196" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.82 5.82"/>
                </g>
                <defs>
                  <filter id="filter0_diin_mobile" x="179.829" y="63.9885" width="227.512" height="227.513" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dx="-3.48946" dy="6.97894"/>
                    <feGaussianBlur stdDeviation="12.2131"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.0904167 0 0 0 0 0.105917 0 0 0 0 0.129167 0 0 0 1 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_mobile"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dx="6.97894" dy="-6.97894"/>
                    <feGaussianBlur stdDeviation="5.23419"/>
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.003125 0 0 0 0 0.0666233 0 0 0 0 0.0833333 0 0 0 0.7 0"/>
                    <feBlend mode="normal" in2="shape" result="effect2_innerShadow_mobile"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dx="-3.48946" dy="3.48946"/>
                    <feGaussianBlur stdDeviation="3.48946"/>
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.0692708 0 0 0 0 0.0875 0 0 0 0.9 0"/>
                    <feBlend mode="normal" in2="effect2_innerShadow_mobile" result="effect3_innerShadow_mobile"/>
                    <feTurbulence type="fractalNoise" baseFrequency="2 2" stitchTiles="stitch" numOctaves="3" result="noise" seed="175" />
                    <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
                    <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                      <feFuncA type="discrete" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "/>
                    </feComponentTransfer>
                    <feComposite operator="in" in2="effect3_innerShadow_mobile" in="coloredNoise1" result="noise1Clipped" />
                    <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
                    <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
                    <feMerge result="effect4_noise_mobile">
                      <feMergeNode in="effect3_innerShadow_mobile" />
                      <feMergeNode in="color1" />
                    </feMerge>
                    <feBlend mode="normal" in="effect4_noise_mobile" in2="effect1_dropShadow_mobile" result="effect4_noise_mobile"/>
                  </filter>
                  <filter id="filter1_d_mobile" x="207.745" y="102.211" width="178.661" height="156.224" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="3.32392"/>
                    <feGaussianBlur stdDeviation="12.8802"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_mobile"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_mobile" result="shape"/>
                  </filter>
                  <filter id="filter2_f_mobile" x="363.549" y="90.3339" width="20.937" height="159.295" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feGaussianBlur stdDeviation="1.57026" result="effect1_foregroundBlur_mobile"/>
                  </filter>
                  <filter id="filter3_f_mobile" x="223.098" y="84.0531" width="145.86" height="13.0853" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feGaussianBlur stdDeviation="1.22131" result="effect1_foregroundBlur_mobile"/>
                  </filter>
                  <linearGradient id="paint0_linear_mobile" x1="233.505" y1="199.846" x2="374.276" y2="103.657" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white"/>
                    <stop offset="1" stopColor="white"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear_mobile" x1="386.405" y1="10.3873" x2="386.405" y2="325.329" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint2_linear_mobile" x1="365.759" y1="107.047" x2="287.811" y2="184.292" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint3_linear_mobile" x1="335.843" y1="107.047" x2="257.895" y2="184.292" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint4_linear_mobile" x1="313.815" y1="269.885" x2="292.215" y2="162.293" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint5_linear_mobile" x1="330.277" y1="244.908" x2="308.678" y2="137.315" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint6_linear_mobile" x1="211.03" y1="140.976" x2="319.31" y2="158.809" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint7_linear_mobile" x1="228.575" y1="165.207" x2="336.855" y2="183.04" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint8_linear_mobile" x1="207.745" y1="10.3873" x2="207.745" y2="325.329" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint9_linear_mobile" x1="14.9451" y1="81.4358" x2="452.715" y2="81.4358" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint10_linear_mobile" x1="14.114" y1="255.942" x2="451.884" y2="255.942" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
             
            </Link>
          </div>
          <div className="header-mobile__actions">
            {user ? (
              <button onClick={handleLogout} className="header-mobile__login">
                Déconnexion
              </button>
            ) : (
              <Link href="/signin" className="header-mobile__login">
                Connexion
              </Link>
            )}
            <button
              className={`header-mobile__menu ${menuOpen ? 'is-active' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6C20 6.55228 19.5523 7 19 7H5C4.44772 7 4 6.55228 4 6ZM4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12ZM5 17C4.44772 17 4 17.4477 4 18C4 18.5523 4.44772 19 5 19H12C12.5523 19 13 18.5523 13 18C13 17.4477 12.5523 17 12 17H5Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </nav>

        {/* Menu Mobile déroulant */}
        {menuOpen && (
          <nav className="header-mobile__dropdown">
            <Link href="/search" className="header-mobile__dropdown-link" onClick={() => setMenuOpen(false)}>
              Rechercher
            </Link>
            <Link href="/gerer-communauté" className="header-mobile__dropdown-link" onClick={() => setMenuOpen(false)}>
              Ajouter un groupe
            </Link>
            {user ? (
              <>
                <Link href="/account" className="header-mobile__dropdown-link" onClick={() => setMenuOpen(false)}>
                  Mon compte
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="header-mobile__dropdown-link header-mobile__dropdown-link--logout">
                  Déconnexion
                </button>
              </>
            ) : (
              <Link href="/signup" className="header-mobile__dropdown-btn" onClick={() => setMenuOpen(false)}>
                S'inscrire
              </Link>
            )}
          </nav>
        )}
      </header>

      {/* Header Desktop */}
      <header className="header-desktop">
        <div className="header-desktop__container">
          {/* Logo - Gauche */}
          <div className="header-desktop__left">
            <Link href="/" className="header-desktop__logo" aria-label="Accueil">
              <svg className="header-desktop__logo-icon" viewBox="0 0 1170 335" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_desktop" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="465" height="335">
                  <path d="M464.793 0H0V334.254H464.793V0Z" fill="white"/>
                </mask>
                <g mask="url(#mask0_desktop)">
                  <g filter="url(#filter0_diin_desktop)">
                    <mask id="mask1_desktop" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="207" y="81" width="180" height="180">
                      <path d="M346.975 81.4358H247.176C225.399 81.4358 207.745 99.0897 207.745 120.867V220.665C207.745 242.442 225.399 260.096 247.176 260.096H346.975C368.752 260.096 386.405 242.442 386.405 220.665V120.867C386.405 99.0897 368.752 81.4358 346.975 81.4358Z" fill="#14272C"/>
                    </mask>
                    <g mask="url(#mask1_desktop)">
                      <path d="M346.975 81.4358H247.176C225.399 81.4358 207.745 99.0897 207.745 120.867V220.665C207.745 242.442 225.399 260.096 247.176 260.096H346.975C368.752 260.096 386.405 242.442 386.405 220.665V120.867C386.405 99.0897 368.752 81.4358 346.975 81.4358Z" fill="#1F1F1F"/>
                      <g filter="url(#filter1_d_desktop)">
                        <path d="M352.576 144.678L345.544 146.287L320.907 151.919L337.286 135.647L344.356 128.617L348.27 124.722H346.603L317.413 124.7L306.429 135.617L287.789 135.602L276.782 124.669L248.404 124.647H245.887L251.77 130.489L256.886 135.58L272.98 151.573L248.615 146.009L241.582 144.399L233.505 142.557L234.85 144.685L250.05 168.671L265.166 172.123L275.152 187.875L271.808 203.004L287.435 227.666L288.33 229.079L289.517 223.688L291.666 213.951L297.045 189.582L302.485 214.222L304.634 223.959L305.821 229.35L306.715 227.937L322.342 203.274L318.999 188.146L328.984 172.393L344.101 168.942L359.3 144.956L360.645 142.828L352.568 144.67L352.576 144.678ZM297.165 181.792L297.105 181.694L297.413 181.401L297.165 181.792ZM296.902 177.754C288.48 177.754 281.651 170.919 281.651 162.491C281.651 154.062 288.48 147.227 296.902 147.227C305.325 147.227 312.154 154.062 312.154 162.491C312.154 170.919 305.325 177.754 296.902 177.754Z" fill="url(#paint0_linear_desktop)" fillOpacity="0.07"/>
                      </g>
                      <g opacity="0.4" filter="url(#filter2_f_desktop)">
                        <path d="M381.346 121.913C381.346 102.547 369.423 96.4989 366.69 93.4744C368.667 98.069 374.541 112.318 374.541 121.913V214.559C374.541 224.469 371.168 241.486 370.005 246.488C371.924 243.405 381.346 237.589 381.346 214.559V121.913Z" fill="white"/>
                      </g>
                      <g opacity="0.8" filter="url(#filter3_f_desktop)">
                        <path d="M246.478 86.4957C236.987 86.4957 228.566 91.9626 225.541 94.6958C230.136 92.7187 237.231 88.7637 246.478 88.7637H339.123C349.033 88.7637 361.514 91.0899 366.516 92.253C363.433 90.3342 353.639 86.4957 339.123 86.4957H246.478Z" fill="white"/>
                      </g>
                    </g>
                  </g>
                  <path d="M386.405 0.831024V333.223" stroke="url(#paint1_linear_desktop)" strokeWidth="1.66196" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.82 5.82"/>
                  <path opacity="0.3" d="M368.124 104.704L285.857 186.228" stroke="url(#paint2_linear_desktop)" strokeWidth="0.830982" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.63 5.63"/>
                  <path opacity="0.3" d="M338.208 104.704L255.941 186.228" stroke="url(#paint3_linear_desktop)" strokeWidth="0.830982" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.63 5.63"/>
                  <path opacity="0.3" d="M314.47 273.15L291.674 159.597" stroke="url(#paint4_linear_desktop)" strokeWidth="0.830977" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.63 5.63"/>
                  <path opacity="0.3" d="M330.932 248.172L308.137 134.619" stroke="url(#paint5_linear_desktop)" strokeWidth="0.830977" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.63 5.63"/>
                  <path opacity="0.3" d="M207.745 140.435L322.025 159.256" stroke="url(#paint6_linear_desktop)" strokeWidth="0.830982" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.63 5.63"/>
                  <path opacity="0.3" d="M225.289 164.666L339.569 183.487" stroke="url(#paint7_linear_desktop)" strokeWidth="0.830982" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.63 5.63"/>
                  <path d="M207.745 0.831024V333.223" stroke="url(#paint8_linear_desktop)" strokeWidth="1.66196" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.82 5.82"/>
                  <path d="M1.66187 81.4358H463.687" stroke="url(#paint9_linear_desktop)" strokeWidth="1.66196" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.82 5.82"/>
                  <path d="M0.830811 255.942H462.855" stroke="url(#paint10_linear_desktop)" strokeWidth="1.66196" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5.82 5.82"/>
                </g>
                <defs>
                  <filter id="filter0_diin_desktop" x="179.829" y="63.9885" width="227.512" height="227.513" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dx="-3.48946" dy="6.97894"/>
                    <feGaussianBlur stdDeviation="12.2131"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.0904167 0 0 0 0 0.105917 0 0 0 0 0.129167 0 0 0 1 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_desktop"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dx="6.97894" dy="-6.97894"/>
                    <feGaussianBlur stdDeviation="5.23419"/>
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.003125 0 0 0 0 0.0666233 0 0 0 0 0.0833333 0 0 0 0.7 0"/>
                    <feBlend mode="normal" in2="shape" result="effect2_innerShadow_desktop"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dx="-3.48946" dy="3.48946"/>
                    <feGaussianBlur stdDeviation="3.48946"/>
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.0692708 0 0 0 0 0.0875 0 0 0 0.9 0"/>
                    <feBlend mode="normal" in2="effect2_innerShadow_desktop" result="effect3_innerShadow_desktop"/>
                    <feTurbulence type="fractalNoise" baseFrequency="2 2" stitchTiles="stitch" numOctaves="3" result="noise" seed="175" />
                    <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
                    <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                      <feFuncA type="discrete" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "/>
                    </feComponentTransfer>
                    <feComposite operator="in" in2="effect3_innerShadow_desktop" in="coloredNoise1" result="noise1Clipped" />
                    <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
                    <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
                    <feMerge result="effect4_noise_desktop">
                      <feMergeNode in="effect3_innerShadow_desktop" />
                      <feMergeNode in="color1" />
                    </feMerge>
                    <feBlend mode="normal" in="effect4_noise_desktop" in2="effect1_dropShadow_desktop" result="effect4_noise_desktop"/>
                  </filter>
                  <filter id="filter1_d_desktop" x="207.745" y="102.211" width="178.661" height="156.224" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="3.32392"/>
                    <feGaussianBlur stdDeviation="12.8802"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_desktop"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_desktop" result="shape"/>
                  </filter>
                  <filter id="filter2_f_desktop" x="363.549" y="90.3339" width="20.937" height="159.295" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feGaussianBlur stdDeviation="1.57026" result="effect1_foregroundBlur_desktop"/>
                  </filter>
                  <filter id="filter3_f_desktop" x="223.098" y="84.0531" width="145.86" height="13.0853" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feGaussianBlur stdDeviation="1.22131" result="effect1_foregroundBlur_desktop"/>
                  </filter>
                  <linearGradient id="paint0_linear_desktop" x1="233.505" y1="199.846" x2="374.276" y2="103.657" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white"/>
                    <stop offset="1" stopColor="white"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear_desktop" x1="386.405" y1="10.3873" x2="386.405" y2="325.329" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint2_linear_desktop" x1="365.759" y1="107.047" x2="287.811" y2="184.292" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint3_linear_desktop" x1="335.843" y1="107.047" x2="257.895" y2="184.292" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint4_linear_desktop" x1="313.815" y1="269.885" x2="292.215" y2="162.293" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint5_linear_desktop" x1="330.277" y1="244.908" x2="308.678" y2="137.315" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint6_linear_desktop" x1="211.03" y1="140.976" x2="319.31" y2="158.809" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint7_linear_desktop" x1="228.575" y1="165.207" x2="336.855" y2="183.04" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint8_linear_desktop" x1="207.745" y1="10.3873" x2="207.745" y2="325.329" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint9_linear_desktop" x1="14.9451" y1="81.4358" x2="452.715" y2="81.4358" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint10_linear_desktop" x1="14.114" y1="255.942" x2="451.884" y2="255.942" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B9B9B" stopOpacity="0"/>
                    <stop offset="0.473958" stopColor="#6A6A6A"/>
                    <stop offset="1" stopColor="#6A6A6A" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="header-desktop__logo-text">GroupFind<span className="header-desktop__logo-dot">.</span>ci</span>
            </Link>
          </div>

          {/* Liens - Centre */}
          <nav className="header-desktop__center">
            <Link href="/search" className="header-desktop__link">Rechercher</Link>
            <Link href="/gerer-communauté" className="header-desktop__link">Ajouter un groupe</Link>
          </nav>

          {/* Auth - Droite */}
          <div className="header-desktop__right" ref={authMenuRef}>
            {user ? (
              <>
                <button 
                  className="header-desktop__auth-btn"
                  onClick={() => setAuthMenuOpen(!authMenuOpen)}
                >
                  <span className="header-desktop__auth-avatar">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                  <span className="header-desktop__auth-name">
                    {user.email?.split('@')[0] || 'Compte'}
                  </span>
                  <svg className="header-desktop__auth-chevron" width="12" height="12" viewBox="0 0 12 12">
                    <path d="M6 8L1 3h10L6 8z" fill="currentColor"/>
                  </svg>
                </button>

                {authMenuOpen && (
                  <div className="header-desktop__auth-dropdown">
                    <Link href="/account" className="header-desktop__auth-dropdown-link" onClick={() => setAuthMenuOpen(false)}>
                      Mon compte
                    </Link>
                    <button onClick={() => { handleLogout(); setAuthMenuOpen(false); }} className="header-desktop__auth-dropdown-link header-desktop__auth-dropdown-link--logout">
                      Déconnexion
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link href="/signin" className="header-desktop__link">Connexion</Link>
                <Link href="/signup" className="header-desktop__btn">S'inscrire</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <style jsx>{`
        /* ===== HEADER MOBILE ===== */
        .header-mobile {
          display: none;
          background: #1e1f22;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: 0 16px;
          height: 56px;
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
        }

        .header-mobile__nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-mobile__logo a {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-mobile__logo-icon {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
        }

        .header-mobile__logo-text {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .header-mobile__logo-dot {
          color: #00a86b;
        }

        .header-mobile__actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-mobile__login {
          color: #b5bac1;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px 12px;
        }

        .header-mobile__login:hover {
          color: #ffffff;
        }

        .header-mobile__menu {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #b5bac1;
          display: flex;
          align-items: center;
        }

        .header-mobile__menu:hover {
          color: #ffffff;
        }

        .header-mobile__dropdown {
          position: absolute;
          top: 56px;
          left: 0;
          right: 0;
          background: #1e1f22;
          padding: 8px 16px 16px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .header-mobile__dropdown-link {
          padding: 10px 12px;
          color: #b5bac1;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 4px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
        }

        .header-mobile__dropdown-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .header-mobile__dropdown-link--logout {
          color: #dc2626;
        }

        .header-mobile__dropdown-link--logout:hover {
          color: #ef4444;
          background: rgba(220, 38, 38, 0.1);
        }

        .header-mobile__dropdown-btn {
          padding: 10px 12px;
          background: #00a86b;
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          text-align: center;
          margin-top: 4px;
        }

        .header-mobile__dropdown-btn:hover {
          background: #008f5a;
        }

        /* ===== HEADER DESKTOP ===== */
        .header-desktop {
          display: flex;
          background: transparent;
          padding: 0 24px;
          height: 72px;
          position: sticky;
          top: 0;
          z-index: 1000;
          align-items: center;
          width: 100%;
          transition: background 0.3s ease;
        }

        .header-desktop__container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* ===== GAUCHE ===== */
        .header-desktop__left {
          display: flex;
          align-items: center;
          min-width: 200px;
        }

        .header-desktop__logo {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-desktop__logo-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
        }

        .header-desktop__logo-text {
          font-size: 1.3rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .header-desktop__logo-dot {
          color: #00a86b;
        }

        /* ===== CENTRE ===== */
        .header-desktop__center {
          display: flex;
          align-items: center;
          gap: 4px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .header-desktop__link {
          padding: 8px 16px;
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 4px;
          transition: all 0.2s ease;
          background: none;
          border: none;
          cursor: pointer;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .header-desktop__link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        /* ===== DROITE ===== */
        .header-desktop__right {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 180px;
          justify-content: flex-end;
          position: relative;
        }

        .header-desktop__auth-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px 6px 8px;
          background: rgba(255, 255, 255, 0.06);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #ffffff;
        }

        .header-desktop__auth-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .header-desktop__auth-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #00a86b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: #ffffff;
        }

        .header-desktop__auth-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: #ffffff;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .header-desktop__auth-chevron {
          color: rgba(255, 255, 255, 0.5);
        }

        .header-desktop__btn {
          padding: 8px 20px;
          background: #00a86b;
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 168, 107, 0.3);
        }

        .header-desktop__btn:hover {
          background: #008f5a;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 168, 107, 0.4);
        }

        /* ===== AUTH DROPDOWN ===== */
        .header-desktop__auth-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #1e1f22;
          border-radius: 8px;
          padding: 6px;
          min-width: 200px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .header-desktop__auth-dropdown-link {
          padding: 10px 14px;
          color: #b5bac1;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 4px;
          transition: all 0.2s ease;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          width: 100%;
        }

        .header-desktop__auth-dropdown-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .header-desktop__auth-dropdown-link--logout {
          color: #dc2626;
        }

        .header-desktop__auth-dropdown-link--logout:hover {
          color: #ef4444;
          background: rgba(220, 38, 38, 0.1);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .header-desktop {
            display: none !important;
          }

          .header-mobile {
            display: block !important;
          }
        }

        @media (min-width: 769px) {
          .header-mobile {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}