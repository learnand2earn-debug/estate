'use client';

import React, { useEffect, useState } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { Plus, Trash2, CheckCircle2, ShieldCheck, LogOut } from 'lucide-react';
import { auth, googleAuthProvider } from '@/src/lib/firebase';
import {
  GALIYAT_LOCATIONS,
  PROPERTY_CATEGORIES,
  INITIAL_SAMPLE_PROPERTIES,
  type PropertyRecord,
} from '@/src/lib/galiyat-data';
import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';

export default function AdminDashboardPage() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [demoAdminActive, setDemoAdminActive] = useState<boolean>(false);

  const [properties, setProperties] = useState<PropertyRecord[]>(() =>
    INITIAL_SAMPLE_PROPERTIES.map((p, idx) => ({ ...p, id: idx + 1 }))
  );
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'properties' | 'add' | 'inquiries'>('properties');
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Add Property Form State
  const [newTitle, setNewTitle] = useState('');
  const [newLocationSlug, setNewLocationSlug] = useState('wholdings');
  const [newPropertyType, setNewPropertyType] = useState('Luxury Mountain Villas');
  const [newPricePkr, setNewPricePkr] = useState('PKR 95,000,000');
  const [newPriceNumeric, setNewPriceNumeric] = useState(95);
  const [newBedrooms, setNewBedrooms] = useState(4);
  const [newBathrooms, setNewBathrooms] = useState(4);
  const [newAreaSqFt, setNewAreaSqFt] = useState(4800);
  const [newDescription, setNewDescription] = useState(
    'SAMPLE PROPERTY — Custom stone and deodar cedar mountain residence overlooking the pine valleys of Galiyat.'
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const token = await user.getIdToken();
        setIdToken(token);
      } else {
        setIdToken(null);
      }
    });
    return () => unsub();
  }, []);

  const activeToken = idToken || (demoAdminActive ? 'DEMO_ADMIN_SESSION' : null);

  const loadPortfolioAndInquiries = async (token: string | null) => {
    try {
      const propRes = await fetch('/api/properties');
      const propData = await propRes.json();
      if (Array.isArray(propData.properties)) {
        setProperties(propData.properties);
      }

      if (token) {
        const inqRes = await fetch('/api/inquiries', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const inqData = await inqRes.json();
        if (Array.isArray(inqData.inquiries)) {
          setInquiries(inqData.inquiries);
        }
      }
    } catch {
      // Keep current state
    }
  };

  useEffect(() => {
    loadPortfolioAndInquiries(activeToken);
  }, [activeToken]);

  const handleGoogleLogin = async () => {
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      const token = await cred.user.getIdToken();
      setIdToken(token);
      setStatusBanner(`Authenticated as ${cred.user.email}`);
    } catch {
      // Enable Demo Admin Workspace if popup is blocked in preview iframe
      setDemoAdminActive(true);
      setStatusBanner('Activated Protected Admin Workspace Session');
    }
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeToken || !newTitle.trim()) return;

    const locObj =
      GALIYAT_LOCATIONS.find((l) => l.slug === newLocationSlug) || GALIYAT_LOCATIONS[0];

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          locationSlug: locObj.slug,
          locationName: locObj.name,
          propertyType: newPropertyType,
          pricePkr: newPricePkr,
          priceNumeric: Number(newPriceNumeric),
          bedrooms: Number(newBedrooms),
          bathrooms: Number(newBathrooms),
          areaSqFt: Number(newAreaSqFt),
          areaLabel: `${Number(newAreaSqFt).toLocaleString()} sq. ft.`,
          description: newDescription,
          isSample: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.property) {
        setProperties((prev) => [data.property, ...prev]);
        setNewTitle('');
        setActiveTab('properties');
        setStatusBanner(`Added "${data.property.title}" to Galiyat portfolio.`);
      }
    } catch {
      setStatusBanner('Could not save property.');
    }
  };

  const handleToggleStatus = async (prop: PropertyRecord) => {
    if (!activeToken) return;
    const nextStatus =
      prop.availabilityStatus === 'Available'
        ? 'Reserved'
        : prop.availabilityStatus === 'Reserved'
        ? 'Sold'
        : 'Available';

    setProperties((prev) =>
      prev.map((p) =>
        p.slug === prop.slug ? { ...p, availabilityStatus: nextStatus } : p
      )
    );

    await fetch(`/api/properties/${prop.slug}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${activeToken}`,
      },
      body: JSON.stringify({ availabilityStatus: nextStatus }),
    });
    setStatusBanner(`Updated ${prop.referenceId} status to ${nextStatus}.`);
  };

  const handleDeleteProperty = async (slug: string, title: string) => {
    if (!activeToken) return;
    setProperties((prev) => prev.filter((p) => p.slug !== slug));
    await fetch(`/api/properties/${slug}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${activeToken}` },
    });
    setStatusBanner(`Removed "${title}" from portfolio.`);
  };

  return (
    <div className="min-h-screen bg-[#101614] text-[#DCE5E0] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <p className="text-xs font-mono-tabular text-[#C7A66A] tracking-wider">
                PROTECTED MANAGEMENT CONSOLE
              </p>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-semibold text-white mt-1">
                Wholdings Admin & Property Portal
              </h1>
            </div>

            {activeToken && (
              <button
                type="button"
                onClick={() => {
                  signOut(auth).catch(() => {});
                  setDemoAdminActive(false);
                  setIdToken(null);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#13241F] border border-white/15 text-xs text-[#DCE5E0] hover:text-white self-start"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out Admin</span>
              </button>
            )}
          </div>

          {statusBanner && (
            <div className="p-4 rounded-xl bg-[#102B24] border border-[#C7A66A]/45 flex items-center justify-between gap-3 text-xs text-white">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C7A66A]" />
                <span>{statusBanner}</span>
              </div>
              <button
                type="button"
                onClick={() => setStatusBanner(null)}
                className="text-[#C7A66A] hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {!activeToken ? (
            /* Admin Authentication Gate */
            <div className="max-w-xl mx-auto p-8 rounded-2xl bg-[#13241F] border border-[#C7A66A]/30 space-y-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#102B24] border border-[#C7A66A]/40 flex items-center justify-center mx-auto text-[#C7A66A]">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h2 className="font-serif-luxury text-3xl font-semibold text-white">
                  Administrator Sign-In Required
                </h2>
                <p className="text-xs sm:text-sm text-[#DCE5E0]/75 leading-relaxed">
                  Public visitors cannot modify property inventory or access private client
                  inquiries. Authenticate with Google Sign-In or launch the Demo Admin
                  Session to test adding, editing, and managing properties.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#C7A66A] text-[#101614] text-xs font-semibold hover:bg-[#d8b87c] transition-colors"
                >
                  Sign In with Google
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDemoAdminActive(true);
                    setStatusBanner('Demo Admin Workspace Enabled');
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#102B24] border border-[#C7A66A]/40 text-xs font-medium text-white hover:bg-[#183E34] transition-colors"
                >
                  Enter Demo Admin Workspace
                </button>
              </div>
            </div>
          ) : (
            /* Authenticated Admin Workspace */
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('properties')}
                  className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'properties'
                      ? 'bg-[#C7A66A] text-[#101614]'
                      : 'bg-[#13241F] text-[#DCE5E0]'
                  }`}
                >
                  Manage Properties ({properties.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('add')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'add'
                      ? 'bg-[#C7A66A] text-[#101614]'
                      : 'bg-[#13241F] text-[#DCE5E0]'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Property</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('inquiries')}
                  className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'inquiries'
                      ? 'bg-[#C7A66A] text-[#101614]'
                      : 'bg-[#13241F] text-[#DCE5E0]'
                  }`}
                >
                  Customer Inquiries ({inquiries.length})
                </button>
              </div>

              {activeTab === 'properties' && (
                <div className="bg-[#13241F] border border-[#C7A66A]/20 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-[11px] font-mono-tabular text-[#C7A66A] uppercase">
                          <th className="py-3.5 px-5">Ref ID</th>
                          <th className="py-3.5 px-5">Property Title</th>
                          <th className="py-3.5 px-5">Location</th>
                          <th className="py-3.5 px-5">Price (PKR)</th>
                          <th className="py-3.5 px-5">Status</th>
                          <th className="py-3.5 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 text-xs">
                        {properties.map((prop) => (
                          <tr key={prop.slug} className="hover:bg-white/5">
                            <td className="py-4 px-5 font-mono-tabular text-[#C7A66A]">
                              {prop.referenceId}
                            </td>
                            <td className="py-4 px-5 font-medium text-white">
                              {prop.title}
                            </td>
                            <td className="py-4 px-5 text-[#DCE5E0]/80">
                              {prop.locationName}
                            </td>
                            <td className="py-4 px-5 font-mono-tabular text-white">
                              {prop.pricePkr}
                            </td>
                            <td className="py-4 px-5 font-mono-tabular">
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(prop)}
                                className="px-3 py-1 rounded bg-[#102B24] border border-[#C7A66A]/40 text-xs text-[#C7A66A] hover:text-white"
                              >
                                {prop.availabilityStatus} (Toggle)
                              </button>
                            </td>
                            <td className="py-4 px-5 text-right">
                              <button
                                type="button"
                                aria-label={`Delete ${prop.title}`}
                                onClick={() => handleDeleteProperty(prop.slug, prop.title)}
                                className="p-2 rounded bg-red-950/60 border border-red-500/30 text-red-300 hover:text-white"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'add' && (
                <form
                  onSubmit={handleAddProperty}
                  className="p-6 sm:p-8 rounded-2xl bg-[#13241F] border border-[#C7A66A]/25 space-y-5 max-w-3xl"
                >
                  <h2 className="font-serif-luxury text-2xl font-semibold text-white">
                    Add New Mountain Property Listing
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="admin-prop-title" className="block text-xs mb-1">
                        Property Title *
                      </label>
                      <input
                        id="admin-prop-title"
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Pine Ridge Cedar Chalet"
                        className="w-full px-3.5 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="admin-prop-loc" className="block text-xs mb-1">
                        Galiyat Location *
                      </label>
                      <select
                        id="admin-prop-loc"
                        value={newLocationSlug}
                        onChange={(e) => setNewLocationSlug(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs text-white"
                      >
                        {GALIYAT_LOCATIONS.map((loc) => (
                          <option key={loc.slug} value={loc.slug}>
                            {loc.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="admin-prop-type" className="block text-xs mb-1">
                        Property Category
                      </label>
                      <select
                        id="admin-prop-type"
                        value={newPropertyType}
                        onChange={(e) => setNewPropertyType(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs text-white"
                      >
                        {PROPERTY_CATEGORIES.filter((c) => c !== 'All Categories').map(
                          (cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="admin-prop-price" className="block text-xs mb-1">
                        Display Price (PKR)
                      </label>
                      <input
                        id="admin-prop-price"
                        type="text"
                        value={newPricePkr}
                        onChange={(e) => setNewPricePkr(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs text-white font-mono-tabular"
                      />
                    </div>

                    <div>
                      <label htmlFor="admin-prop-num" className="block text-xs mb-1">
                        Numeric Price (Millions)
                      </label>
                      <input
                        id="admin-prop-num"
                        type="number"
                        value={newPriceNumeric}
                        onChange={(e) => setNewPriceNumeric(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs text-white font-mono-tabular"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="admin-beds" className="block text-xs mb-1">
                        Bedrooms
                      </label>
                      <input
                        id="admin-beds"
                        type="number"
                        value={newBedrooms}
                        onChange={(e) => setNewBedrooms(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="admin-baths" className="block text-xs mb-1">
                        Bathrooms
                      </label>
                      <input
                        id="admin-baths"
                        type="number"
                        value={newBathrooms}
                        onChange={(e) => setNewBathrooms(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="admin-area" className="block text-xs mb-1">
                        Area (sq. ft.)
                      </label>
                      <input
                        id="admin-area"
                        type="number"
                        value={newAreaSqFt}
                        onChange={(e) => setNewAreaSqFt(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="admin-desc" className="block text-xs mb-1">
                      Architectural Description
                    </label>
                    <textarea
                      id="admin-desc"
                      rows={3}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-[#C7A66A] text-[#101614] text-xs font-semibold hover:bg-[#d8b87c]"
                  >
                    Publish Property to Galiyat Portfolio
                  </button>
                </form>
              )}

              {activeTab === 'inquiries' && (
                <div className="bg-[#13241F] border border-[#C7A66A]/20 rounded-2xl p-6 space-y-4">
                  <h2 className="font-serif-luxury text-2xl font-semibold text-white">
                    Submitted Client & Investment Inquiries
                  </h2>
                  {inquiries.length === 0 ? (
                    <p className="text-xs text-[#DCE5E0]/70">
                      No inquiries submitted yet. Submit a form on any property or contact
                      page to see live entries here.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="p-4 rounded-xl bg-[#101614] border border-white/10 space-y-1.5 text-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-semibold text-white">
                              {inq.fullName} · {inq.phoneWhatsapp} ({inq.email})
                            </span>
                            <span className="font-mono-tabular text-[#C7A66A]">
                              {inq.locationInterest} · {inq.inquiryType}
                            </span>
                          </div>
                          <p className="text-[#DCE5E0]/80">{inq.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
