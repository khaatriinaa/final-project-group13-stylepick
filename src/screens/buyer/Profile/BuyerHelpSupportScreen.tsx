// src/screens/buyer/Profile/BuyerHelpSupportScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable,
  Linking, StyleSheet, LayoutAnimation,
  Platform, UIManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const FAQS: { q: string; a: string }[] = [
  {
    q: 'How do I place an order?',
    a: 'Browse products, tap "Add to Cart", and proceed to checkout. You can review your order before confirming payment.',
  },
  {
    q: 'How do I track my order?',
    a: 'Go to the Orders tab to see the real-time status of all your purchases, from pending to delivered.',
  },
  {
    q: 'Can I cancel an order?',
    a: 'You may cancel an order while it is still in Pending status. Once a seller starts preparing it, cancellation is no longer available.',
  },
  {
    q: 'How do I update my delivery address?',
    a: 'Go to Profile → Edit Profile and update your Delivery Address, or use "Get Current Location" on the Profile screen to auto-fill your address.',
  },
  {
    q: 'How do I change my profile photo?',
    a: 'Tap your avatar on the Profile screen. You can take a new photo or choose one from your gallery.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We currently support cash on delivery. Additional payment methods will be available in a future update.',
  },
  {
    q: 'How do I contact a seller?',
    a: 'Currently, all order concerns are handled through our support team. Reach out via the contact options below.',
  },
];

const CONTACT_ITEMS = [
  {
    id: 'email',
    icon: '✉️',
    label: 'Email Support',
    value: 'stylepick@gmail.com',
    action: () => Linking.openURL('mailto:stylepick@gmail.com'),
  },
  {
    id: 'phone',
    icon: '📞',
    label: 'Call Us',
    value: '+63 2 8888 0000',
    action: () => Linking.openURL('tel:+6328888000'),
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  };

  return (
    <Pressable
      onPress={toggle}
      style={({ pressed }) => [s.faqItem, pressed && s.faqItemPressed]}
    >
      <View style={s.faqHeader}>
        <Text style={s.faqQ}>{q}</Text>
        <Text style={s.faqChevron}>{open ? '▴' : '▾'}</Text>
      </View>
      {open && <Text style={s.faqA}>{a}</Text>}
    </Pressable>
  );
}

export default function BuyerHelpSupportScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>

      {/* ── Header ── */}
      <View style={s.header}>
        <Pressable
          style={({ pressed }) => [s.backBtn, pressed && s.backBtnPressed]}
          onPress={() => navigation.goBack()}
        >
          <Text style={s.backBtnText}>‹</Text>
        </Pressable>
        <Text style={s.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── Banner (same dark tone as EditProfile avatar section) ── */}
      <View style={s.banner}>
        <Text style={s.bannerIcon}>🛟</Text>
        <Text style={s.bannerTitle}>How can we help you?</Text>
        <Text style={s.bannerSub}>
          Browse the FAQs below or reach out to our support team directly.
        </Text>
      </View>

      {/* ── Contact ── */}
      <View style={s.sectionWrap}>
        <Text style={s.sectionLabel}>Contact Us</Text>
        <View style={s.card}>
          {CONTACT_ITEMS.map((item, i) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                s.contactRow,
                i < CONTACT_ITEMS.length - 1 && s.rowBorder,
                pressed && s.rowPressed,
              ]}
              onPress={item.action}
            >
              <Text style={s.contactIcon}>{item.icon}</Text>
              <View style={s.contactInfo}>
                <Text style={s.contactLabel}>{item.label}</Text>
                <Text style={s.contactValue}>{item.value}</Text>
              </View>
              <Text style={s.menuArrow}>›</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── FAQs ── */}
      <View style={s.sectionWrap}>
        <Text style={s.sectionLabel}>Frequently Asked Questions</Text>
        <View style={s.card}>
          {FAQS.map((faq, i) => (
            <View key={i} style={i < FAQS.length - 1 ? s.rowBorder : undefined}>
              <FaqItem q={faq.q} a={faq.a} />
            </View>
          ))}
        </View>
      </View>

      {/* ── Footer ── */}
      <Text style={s.footer}>
        StylePick Buyer Support · v1.0.0{'\n'}
        © 2026 StylePick Philippines. All rights reserved.
      </Text>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  /* ── Header (matches EditProfileScreen) ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111827',
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnPressed: {
    opacity: 0.6,
  },
  backBtnText: {
    fontSize: 24,
    color: '#FFFFFF',
    lineHeight: 28,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  /* ── Banner (matches EditProfile avatar section tone) ── */
  banner: {
    backgroundColor: '#1F2937',
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  bannerIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  bannerSub: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 19,
  },

  /* ── Sections ── */
  sectionWrap: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingLeft: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rowPressed: {
    backgroundColor: '#F9FAFB',
  },
  menuArrow: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: '300',
  },

  /* ── Contact ── */
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  contactIcon: {
    fontSize: 18,
    width: 28,
    textAlign: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 12,
    color: '#6B7280',
  },

  /* ── FAQ ── */
  faqItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  faqItemPressed: {
    backgroundColor: '#F9FAFB',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  faqQ: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 20,
  },
  faqChevron: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  faqA: {
    marginTop: 8,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },

  /* ── Footer ── */
  footer: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
});