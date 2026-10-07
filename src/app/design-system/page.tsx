"use client";

import * as React from "react";
import {
  Button,
  Input,
  Select,
  Checkbox,
  Badge,
  Modal,
  Drawer,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Skeleton,
  Breadcrumb,
  Rating,
  QuantityStepper,
  ProductCard,
  EmptyState,
  ErrorState,
  showToast,
} from "@/components/ui";
import { Mail, Heart, ShoppingBag, Sparkles, Layers, Palette, Type } from "lucide-react";

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [stepperVal, setStepperVal] = React.useState(2);
  const [interactiveRating, setInteractiveRating] = React.useState(4);
  const [selectVal, setSelectVal] = React.useState("kanchipuram");
  const [checkedVal, setCheckedVal] = React.useState(true);
  const [wishlisted, setWishlisted] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="border-b border-[#E8E2D8] pb-8 mb-12">
        <div className="flex items-center gap-2 text-[#B79B63] mb-2">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs uppercase tracking-[0.25em] font-medium">
            Living Design System & Component Library
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif text-[#1C1B19] font-normal tracking-wide">
          Sreesha Elegance Atelier Kit
        </h1>
        <p className="mt-2 text-sm text-[#5A5650] max-w-2xl leading-relaxed">
          Comprehensive tokens, accessible components, and state matrices adhering to the brand
          guidelines: Ivory (#FAF7F2), Charcoal (#1C1B19), and Muted Gold (#B79B63).
        </p>
      </div>

      <div className="space-y-16">
        {/* Section 0: Color & Typography Tokens */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[#E8E2D8] pb-3">
            <Palette className="h-4 w-4 text-[#B79B63]" />
            <h2 className="text-xl font-serif text-[#1C1B19]">01. Color Palette & Typography</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8]">
              <div className="h-12 w-full bg-[#FAF7F2] border border-[#E8E2D8] mb-2" />
              <p className="text-xs font-semibold text-[#1C1B19]">Ivory Canvas</p>
              <p className="text-[10px] text-[#8C867D]">#FAF7F2</p>
            </div>
            <div className="p-4 bg-white border border-[#E8E2D8]">
              <div className="h-12 w-full bg-[#F5F2EB] border border-[#E8E2D8] mb-2" />
              <p className="text-xs font-semibold text-[#1C1B19]">Warm Surface</p>
              <p className="text-[10px] text-[#8C867D]">#F5F2EB</p>
            </div>
            <div className="p-4 bg-white border border-[#E8E2D8]">
              <div className="h-12 w-full bg-[#1C1B19] mb-2" />
              <p className="text-xs font-semibold text-[#1C1B19]">Deep Charcoal</p>
              <p className="text-[10px] text-[#8C867D]">#1C1B19</p>
            </div>
            <div className="p-4 bg-white border border-[#E8E2D8]">
              <div className="h-12 w-full bg-[#B79B63] mb-2" />
              <p className="text-xs font-semibold text-[#1C1B19]">Champagne Gold</p>
              <p className="text-[10px] text-[#8C867D]">#B79B63</p>
            </div>
            <div className="p-4 bg-white border border-[#E8E2D8]">
              <div className="h-12 w-full bg-[#2D6A4F] mb-2" />
              <p className="text-xs font-semibold text-[#1C1B19]">Emerald Success</p>
              <p className="text-[10px] text-[#8C867D]">#2D6A4F</p>
            </div>
            <div className="p-4 bg-white border border-[#E8E2D8]">
              <div className="h-12 w-full bg-[#9A3434] mb-2" />
              <p className="text-xs font-semibold text-[#1C1B19]">Crimson Error</p>
              <p className="text-[10px] text-[#8C867D]">#9A3434</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white border border-[#E8E2D8]">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B79B63]">
                Display & Headings
              </span>
              <p className="font-serif text-3xl text-[#1C1B19] mt-1">Cormorant Garamond</p>
              <p className="font-serif text-lg text-[#5A5650] italic mt-1">
                &ldquo;Wear Your Elegance with royal heritage from Hyderabad.&rdquo;
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B79B63]">
                Body & Interface
              </span>
              <p className="font-sans text-xl text-[#1C1B19] mt-1">Inter / Clean Sans</p>
              <p className="text-xs text-[#5A5650] mt-1 leading-relaxed">
                Legible, high-contrast UI typography optimized for touch targets, micro-labels,
                pricing numbers, and editorial product specifications.
              </p>
            </div>
          </div>
        </section>

        {/* Section 1: Buttons */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[#E8E2D8] pb-3">
            <Layers className="h-4 w-4 text-[#B79B63]" />
            <h2 className="text-xl font-serif text-[#1C1B19]">02. Button Variants & States</h2>
          </div>

          <div className="p-6 bg-white border border-[#E8E2D8] space-y-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#8C867D] mb-3">Variants</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary Charcoal</Button>
                <Button variant="secondary">Secondary Warm</Button>
                <Button variant="gold">Gold Accent</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="outlineGold">Outline Gold</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="link">Text Link</Button>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-[#8C867D] mb-3">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small (36px)</Button>
                <Button size="md">Medium (44px)</Button>
                <Button size="lg">Large (52px)</Button>
                <Button size="icon" variant="outline" aria-label="Heart icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-[#8C867D] mb-3">
                States (Loading & Disabled)
              </p>
              <div className="flex flex-wrap gap-3">
                <Button loading>Processing Order</Button>
                <Button disabled variant="primary">
                  Disabled Primary
                </Button>
                <Button disabled variant="outline">
                  Disabled Outline
                </Button>
                <Button
                  variant="primary"
                  leftIcon={<ShoppingBag className="h-3.5 w-3.5 text-[#B79B63]" />}
                >
                  Add To Bag
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Form Controls (Input, Select, Checkbox) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[#E8E2D8] pb-3">
            <Type className="h-4 w-4 text-[#B79B63]" />
            <h2 className="text-xl font-serif text-[#1C1B19]">03. Form Inputs & Selectors</h2>
          </div>

          <div className="p-6 bg-white border border-[#E8E2D8] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input
              label="Customer Full Name"
              placeholder="e.g. Sreya Reddy"
              helperText="As printed on government ID for verification"
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="sreya@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <Input
              label="PIN Code (Serviceability)"
              placeholder="500034"
              error="Delivery not serviceable for this PIN prefix"
              defaultValue="999999"
            />

            <Select
              label="Fabric Selection"
              value={selectVal}
              onValueChange={setSelectVal}
              options={[
                { value: "kanchipuram", label: "Pure Kanchipuram Silk" },
                { value: "organza", label: "Sheer Tissue Organza" },
                { value: "chanderi", label: "Handwoven Chanderi" },
                { value: "georgette", label: "Pure Banarasi Georgette" },
              ]}
              helperText="Certified handloom grade weave"
            />

            <Select
              label="Disabled Select"
              disabled
              options={[{ value: "1", label: "Out of Stock" }]}
              placeholder="Fabric Currently Unavailable"
            />

            <div className="space-y-4 pt-2">
              <span className="block text-[11px] uppercase tracking-[0.14em] font-medium text-[#1C1B19]">
                Checkboxes & Consent
              </span>
              <Checkbox
                checked={checkedVal}
                onCheckedChange={(c) => setCheckedVal(!!c)}
                label="Boutique Bridal Styling"
                description="Receive complimentary virtual draping assistance via WhatsApp"
              />
              <Checkbox
                label="Accept Terms & DPDP Consent"
                error="You must agree before proceeding to order checkout"
              />
              <Checkbox disabled label="Unavailable Express Delivery" />
            </div>
          </div>
        </section>

        {/* Section 3: Badges, Rating & Stepper */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[#E8E2D8] pb-3">
            <Sparkles className="h-4 w-4 text-[#B79B63]" />
            <h2 className="text-xl font-serif text-[#1C1B19]">
              04. Badges, Rating & Quantity Stepper
            </h2>
          </div>

          <div className="p-6 bg-white border border-[#E8E2D8] grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#8C867D] mb-3">Badges</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="gold">NEW</Badge>
                <Badge variant="goldSolid">HANDWOVEN</Badge>
                <Badge variant="sale">-30% OFF</Badge>
                <Badge variant="success">IN STOCK</Badge>
                <Badge variant="outline">SILK MARK</Badge>
                <Badge variant="subtle">LIMITED</Badge>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-[#8C867D] mb-3">
                Rating (Read-only & Interactive)
              </p>
              <div className="space-y-3">
                <div>
                  <Rating value={4.8} count={42} size="md" />
                  <p className="text-[10px] text-[#8C867D] mt-0.5">Read-only product aggregate</p>
                </div>
                <div>
                  <Rating
                    value={interactiveRating}
                    onChange={setInteractiveRating}
                    interactive
                    showCount={false}
                    size="lg"
                  />
                  <p className="text-[10px] text-[#8C867D] mt-0.5">
                    Click to rate: {interactiveRating} stars
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-[#8C867D] mb-3">
                Quantity Stepper
              </p>
              <div className="space-y-3">
                <QuantityStepper value={stepperVal} onChange={setStepperVal} min={1} max={5} />
                <p className="text-[10px] text-[#8C867D]">
                  Current count: {stepperVal} (Max stock: 5 units)
                </p>
                <QuantityStepper value={1} onChange={() => {}} disabled />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Breadcrumbs, Skeletons, Tabs & Accordions */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[#E8E2D8] pb-3">
            <Layers className="h-4 w-4 text-[#B79B63]" />
            <h2 className="text-xl font-serif text-[#1C1B19]">
              05. Breadcrumbs, Skeletons, Tabs & Accordion
            </h2>
          </div>

          <div className="p-6 bg-white border border-[#E8E2D8] space-y-8">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#8C867D] mb-2">Breadcrumb</p>
              <Breadcrumb
                items={[
                  { label: "Women", href: "/women" },
                  { label: "Sarees", href: "/women/sarees" },
                  { label: "Pure Kanchipuram Silk Saree in Crimson Gold" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Accordion */}
              <div>
                <p className="text-xs uppercase tracking-wider text-[#8C867D] mb-3">
                  Accordion (PDP Specifications)
                </p>
                <Accordion type="single" collapsible defaultValue="materials">
                  <AccordionItem value="description">
                    <AccordionTrigger>Atelier Description</AccordionTrigger>
                    <AccordionContent>
                      Imbued with royal Hyderabadi heritage, this handcrafted weave features
                      intricate zari motifs woven by master artisans over three weeks.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="materials">
                    <AccordionTrigger>Materials & Silk Mark</AccordionTrigger>
                    <AccordionContent>
                      100% Pure Mulberry Silk with certified silver & gold electroplated zari.
                      Accompanied by an authentic Silk Mark India certificate.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="shipping">
                    <AccordionTrigger>Complimentary Shipping & Returns</AccordionTrigger>
                    <AccordionContent>
                      Free express delivery across Hyderabad and major Indian metros. 7-day
                      hassle-free boutique exchange guarantee.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Tabs */}
              <div>
                <p className="text-xs uppercase tracking-wider text-[#8C867D] mb-3">Tabs</p>
                <Tabs defaultValue="craft">
                  <TabsList>
                    <TabsTrigger value="craft">The Craft</TabsTrigger>
                    <TabsTrigger value="sizing">Atelier Fit</TabsTrigger>
                    <TabsTrigger value="care">Care Instructions</TabsTrigger>
                  </TabsList>
                  <TabsContent value="craft">
                    <p className="text-xs text-[#5A5650] leading-relaxed">
                      Each piece is hand-spun and hand-dyed in small batches to preserve fabric
                      integrity and reduce environmental footprint.
                    </p>
                  </TabsContent>
                  <TabsContent value="sizing">
                    <p className="text-xs text-[#5A5650] leading-relaxed">
                      Standard Indian sizing with generous 2-inch boutique seam margins for custom
                      adjustments.
                    </p>
                  </TabsContent>
                  <TabsContent value="care">
                    <p className="text-xs text-[#5A5650] leading-relaxed">
                      Dry clean only. Store wrapped in soft muslin cloth away from direct sunlight.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Skeletons */}
            <div>
              <p className="text-xs uppercase tracking-wider text-[#8C867D] mb-3">
                Loading Skeletons (Shimmer State)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Skeleton className="h-48 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-9 w-full mt-4" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12" rounded="full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Modal, Drawer & Toasts */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[#E8E2D8] pb-3">
            <Sparkles className="h-4 w-4 text-[#B79B63]" />
            <h2 className="text-xl font-serif text-[#1C1B19]">
              06. Overlays (Modal, Drawer, Toast)
            </h2>
          </div>

          <div className="p-6 bg-white border border-[#E8E2D8] flex flex-wrap gap-4 items-center">
            {/* Modal Trigger */}
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Open Size Guide Modal
            </Button>

            <Modal
              open={modalOpen}
              onOpenChange={setModalOpen}
              title="Atelier Size & Fitting Guide"
              description="Measurements are shown in inches with corresponding bust, waist, and hip guidelines."
            >
              <div className="py-2 space-y-4">
                <div className="border border-[#E8E2D8] overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] border-b border-[#E8E2D8] uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-2.5">Size</th>
                        <th className="p-2.5">Bust (in)</th>
                        <th className="p-2.5">Waist (in)</th>
                        <th className="p-2.5">Hip (in)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E2D8] text-[#5A5650]">
                      <tr>
                        <td className="p-2.5 font-medium text-[#1C1B19]">XS</td>
                        <td className="p-2.5">32</td>
                        <td className="p-2.5">26</td>
                        <td className="p-2.5">36</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-[#1C1B19]">S</td>
                        <td className="p-2.5">34</td>
                        <td className="p-2.5">28</td>
                        <td className="p-2.5">38</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-[#1C1B19]">M</td>
                        <td className="p-2.5">36</td>
                        <td className="p-2.5">30</td>
                        <td className="p-2.5">40</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-[#1C1B19]">L</td>
                        <td className="p-2.5">38</td>
                        <td className="p-2.5">32</td>
                        <td className="p-2.5">42</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </Modal>

            {/* Drawer Trigger */}
            <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
              Open Shopping Bag Drawer
            </Button>

            <Drawer
              open={drawerOpen}
              onOpenChange={setDrawerOpen}
              title="Your Shopping Bag (1 Item)"
              description="Complimentary express shipping applied"
              side="right"
            >
              <div className="space-y-4">
                <div className="flex gap-3 pb-4 border-b border-[#E8E2D8]">
                  <div className="h-20 w-16 bg-[#EFE8DD] shrink-0 border border-[#E8E2D8]" />
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-medium text-[#1C1B19]">
                      Sreesha Kanchipuram Silk Saree
                    </p>
                    <p className="text-[10px] text-[#8C867D]">Colour: Crimson Red • Size: Free</p>
                    <p className="text-xs font-semibold text-[#1C1B19]">₹24,999</p>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-[#5A5650]">
                    <span>Subtotal</span>
                    <span>₹24,999</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#5A5650]">
                    <span>Shipping</span>
                    <span className="text-[#2D6A4F] uppercase font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-[#1C1B19] pt-2 border-t border-[#E8E2D8]">
                    <span>Total (Incl. all GST)</span>
                    <span>₹24,999</span>
                  </div>
                </div>

                <Button variant="primary" className="w-full mt-4" size="lg">
                  Proceed to Checkout
                </Button>
              </div>
            </Drawer>

            {/* Toast Triggers */}
            <Button
              variant="gold"
              onClick={() =>
                showToast.success(
                  "Ensemble Added to Bag",
                  "Pure Kanchipuram Saree (Size Free) added to your selection."
                )
              }
            >
              Trigger Success Toast
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                showToast.error(
                  "PIN Code Unserviceable",
                  "Standard courier delivery is temporarily unavailable in this territory."
                )
              }
            >
              Trigger Error Toast
            </Button>

            <Button
              variant="ghost"
              onClick={() =>
                showToast.info(
                  "Boutique Wishlist Synced",
                  "Saved items are securely linked to your guest session."
                )
              }
            >
              Trigger Info Toast
            </Button>
          </div>
        </section>

        {/* Section 6: ProductCard Showcase */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[#E8E2D8] pb-3">
            <ShoppingBag className="h-4 w-4 text-[#B79B63]" />
            <h2 className="text-xl font-serif text-[#1C1B19]">07. ProductCard Component</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard
              id="prod-1"
              slug="kanchipuram-silk-saree-crimson"
              title="Sreesha Kanchipuram Silk Saree in Crimson Gold"
              category="Sarees"
              price={24999}
              originalPrice={32999}
              badge="NEW"
              rating={4.9}
              reviewCount={18}
              primaryImage="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
              secondaryImage="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
              isWishlisted={wishlisted}
              onWishlistToggle={() => {
                setWishlisted(!wishlisted);
                showToast.info(wishlisted ? "Removed from Wishlist" : "Saved to Wishlist");
              }}
              onQuickAdd={(id, sz) =>
                showToast.success("Added to Bag", `Size ${sz || "M"} added successfully`)
              }
              onQuickView={() => setModalOpen(true)}
            />

            <ProductCard
              id="prod-2"
              slug="noor-embroidered-bridal-lehenga"
              title="Noor Hand-Embroidered Zardozi Bridal Lehenga"
              category="Lehengas"
              price={48999}
              originalPrice={58999}
              badge="BESTSELLER"
              rating={5.0}
              reviewCount={24}
              primaryImage="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
              secondaryImage="https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80"
              onQuickAdd={(id, sz) =>
                showToast.success("Added to Bag", `Size ${sz || "M"} added successfully`)
              }
              onQuickView={() => setModalOpen(true)}
            />

            <ProductCard
              id="prod-3"
              slug="aadhya-anarkali-suit"
              title="Aadhya Organza Anarkali Set with Pearl Border"
              category="Kurtis & Anarkalis"
              price={9999}
              originalPrice={12999}
              rating={4.7}
              reviewCount={12}
              primaryImage="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
              secondaryImage="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
              onQuickAdd={(id, sz) =>
                showToast.success("Added to Bag", `Size ${sz || "M"} added successfully`)
              }
              onQuickView={() => setModalOpen(true)}
            />

            <ProductCard
              id="prod-4"
              slug="meher-chanderi-kurta"
              title="Meher Handblock Chanderi Silk Kurta"
              category="Contemporary"
              price={4499}
              originalPrice={5499}
              badge="SALE"
              rating={4.8}
              reviewCount={9}
              primaryImage="https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80"
              secondaryImage="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
              onQuickAdd={(id, sz) =>
                showToast.success("Added to Bag", `Size ${sz || "M"} added successfully`)
              }
              onQuickView={() => setModalOpen(true)}
            />
          </div>
        </section>

        {/* Section 7: Empty & Error States */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[#E8E2D8] pb-3">
            <Sparkles className="h-4 w-4 text-[#B79B63]" />
            <h2 className="text-xl font-serif text-[#1C1B19]">08. Empty & Error State Templates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-[#E8E2D8]">
              <EmptyState
                icon={Heart}
                title="Your Wishlist is Empty"
                description="Explore our Hyderabad atelier's silk sarees and bridal lehengas to curate your dream personal collection."
                actionLabel="Explore Sarees"
                actionHref="/women/sarees"
              />
            </div>

            <div className="p-6 bg-white border border-[#E8E2D8]">
              <ErrorState
                title="Payment Signature Verification Failed"
                message="We could not securely verify the transaction confirmation token from Razorpay. Your card has not been debited."
                onRetry={() => showToast.info("Retrying verification...")}
                actionLabel="Retry Verification"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
