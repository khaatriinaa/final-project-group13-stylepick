// src/screens/seller/Profile/SellerHelpSupportScreen.tsx
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
    q: 'How do I add a new product?',
    a: 'Go to the Products tab, tap the "+" button in the top-right corner, fill in the product details, and tap Save.',
  },
  {
    q: 'How do I process an order?',
    a: 'Open the Orders tab, select a pending order, then tap "Mark as Preparing" once you start processing it and "Mark as Delivered" when it ships.',
  },
  {
    q: 'How do I update my store location?',
    a: 'Go to Profile → Store Location. The app will request your device location and save it automatically.',
  },
  {
    q: 'When will I receive my payouts?',
    a: 'Payouts are processed every Friday for all orders marked as Delivered during the week. You will receive an email confirmation.',
  },
  {
    q: 'How do I change my profile photo?',
    a: 'Tap your avatar on the Profile screen. You can take a new photo or choose one from your gallery.',
  },
  {
    q: 'What happens if a buyer cancels an order?',
    a: 'The order status will update to Cancelled automatically and your inventory will be restocked. No action is needed from you.',
  },
];

const CONTACT_ITEMS = [
  {
    id: 'email',
    icon: '✉️',
    label: 'Email Support',
    value: 'stylepick@gmail.com',
    action: () => Linking.openURL('mailto:stylepick@gmail.com'), // ← fixed
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

export default function SellerHelpSupportScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>

      {/* ── Top bar ── */}
      <View style={s.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [s.topBtn, pressed && s.topBtnPressed]}
        >
          <Text style={s.topBtnText}>‹ Back</Text>
        </Pressable>
        <Text style={s.topTitle}>Help & Support</Text>
        <View style={s.topBtn} />
      </View>

      {/* ── Banner ── */}
      <View style={s.banner}>
        <Text style={s.bannerIcon}>🛟</Text>
        <Text style={s.bannerTitle}>How can we help you?</Text>
        <Text style={s.bannerSub}>
          Browse the FAQs below or reach out to our support team directly.
        </Text>
      </View>

      {/* ── Contact options ── */}
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
            <View key={i} style={i < FAQS.length - 1 && s.rowBorder}>
              <FaqItem q={faq.q} a={faq.a} />
            </View>
          ))}
        </View>
      </View>

      {/* ── Footer note ── */}
      <Text style={s.footer}>
        StylePick Seller Support · v1.0.0{'\n'}
        © 2026 StylePick Philippines. All rights reserved.
      </Text>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  /* ── Top bar ── */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  topTitle:       { fontSize: 16, fontWeight: '700', color: '#111827' },
  topBtn:         { minWidth: 60, paddingVertical: 4, paddingHorizontal: 4, borderRadius: 8 },
  topBtnPressed:  { backgroundColor: '#F3F4F6' },
  topBtnText:     { fontSize: 14, fontWeight: '600', color: '#111827' },

  /* ── Banner ── */
  banner: {
    backgroundColor: '#111827',
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  bannerIcon:  { fontSize: 36, marginBottom: 10 },
  bannerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 6 },
  bannerSub:   { fontSize: 13, color: '#9CA3AF', textAlign: 'center', lineHeight: 19 },

  /* ── Shared ── */
  sectionWrap: { paddingHorizontal: 16, marginTop: 20 },
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
  rowBorder:  { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  rowPressed: { backgroundColor: '#F9FAFB' },
  menuArrow:  { fontSize: 20, color: '#9CA3AF', fontWeight: '300' },

  /* ── Contact ── */
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  contactIcon:  { fontSize: 20, width: 28, textAlign: 'center' },
  contactInfo:  { flex: 1 },
  contactLabel: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 2 },
  contactValue: { fontSize: 12, color: '#6B7280' },

  /* ── FAQ ── */
  faqItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  faqItemPressed: { backgroundColor: '#F9FAFB' },
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
  faqChevron: { fontSize: 12, color: '#9CA3AF' },
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