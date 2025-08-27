# 🧪 VowCRM - Testing Guide

## 🚀 Quick Start Testing

### Application Status: ✅ RUNNING
- **Development Server**: `http://localhost:3000`
- **Status**: Active and responding
- **Hot Reload**: Enabled

## 🎯 Test Scenarios

### 1. **Login Page Testing**
📍 **URL**: `http://localhost:3000/login`

**What to Test:**
- [ ] **Split-screen layout** displays correctly
- [ ] **Hero section** shows wedding couple branding on the left
- [ ] **Login form** appears on the right with proper styling
- [ ] **Form validation** works (try invalid email, empty fields)
- [ ] **Password visibility toggle** functions
- [ ] **Wedding theme colors** are applied (Navy, Rose Gold, Sage)
- [ ] **Demo credentials** work:
  - Email: `demo@weddinglead.com`
  - Password: `demo123`
- [ ] **Responsive design** on mobile (use browser dev tools)

### 2. **Dashboard Testing**
📍 **URL**: `http://localhost:3000/` or `http://localhost:3000/dashboard`

**What to Test:**
- [ ] **Welcome message** displays with current date
- [ ] **Quick stats bar** shows metrics in gradient card
- [ ] **Lead pipeline funnel** visual with color-coded stages
- [ ] **Recent wedding leads** list with couple avatars and badges
- [ ] **Metric cards** with trend indicators and proper icons
- [ ] **Upcoming follow-ups** with priority badges
- [ ] **Market insights** section with wedding season data
- [ ] **Animation effects** (fade-in, hover states)

### 3. **Lead Management Testing**
📍 **URL**: `http://localhost:3000/leads`

**What to Test:**
- [ ] **Advanced filters** work (search, platform, status, score, priority)
- [ ] **Table sorting** functions on sortable columns
- [ ] **Row selection** (individual and select all)
- [ ] **Bulk actions** appear when rows selected
- [ ] **Lead score visualization** with color-coded circles
- [ ] **Status badges** display correctly
- [ ] **Priority badges** show appropriate colors
- [ ] **Action buttons** (view, email, phone) are clickable
- [ ] **Pagination** works at bottom of table
- [ ] **Row hover effects** and responsive design

### 4. **Navigation Testing**

**What to Test:**
- [ ] **Sidebar navigation** highlights active page
- [ ] **Wedding branding** shows in sidebar header
- [ ] **User profile** section at bottom of sidebar
- [ ] **Page titles** update correctly in header
- [ ] **Dark mode toggle** functions (if implemented)
- [ ] **All navigation links** are accessible

## 🎨 Visual Design Verification

### Color Palette Check
- [ ] **Deep Navy** (#1e3a5f) - Primary elements, headers, buttons
- [ ] **Rose Gold** (#e8b4a0) - Secondary buttons, accents, couple avatars
- [ ] **Sage Green** (#9caf88) - Success states, accent badges
- [ ] **Warm Gray** (#f5f5f5) - Backgrounds, neutral text

### Typography Check
- [ ] **Headers** use Inter/Poppins font family
- [ ] **Body text** uses Open Sans/Source Sans Pro
- [ ] **Accent text** uses Playfair Display (elegant serif)

### Wedding Theme Elements
- [ ] **Heart icons** in couple representations
- [ ] **Wedding date displays** with calendar icons
- [ ] **Gradient backgrounds** with wedding patterns
- [ ] **Elegant card shadows** and rounded corners
- [ ] **Professional metric displays** with mortgage industry feel

## 📱 Responsive Design Testing

### Desktop (1200px+)
- [ ] Full sidebar navigation visible
- [ ] 3-4 column grid layouts display correctly
- [ ] All hover states and animations work
- [ ] Tables show full data without scrolling issues

### Tablet (768px - 1199px)
- [ ] Sidebar collapses appropriately
- [ ] Grid layouts adapt to 2 columns
- [ ] Touch-friendly button sizes
- [ ] Tables scroll horizontally when needed

### Mobile (< 768px)
- [ ] Navigation adapts to mobile layout
- [ ] Single column layouts work
- [ ] Forms display one field per row
- [ ] All interactions are touch-friendly

## 🔧 Technical Testing

### Performance
- [ ] **Page load times** are reasonable (< 2 seconds)
- [ ] **Hot reload** works during development
- [ ] **Animations** are smooth and not janky
- [ ] **No console errors** in browser developer tools

### Browser Compatibility
Test in multiple browsers:
- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (if on Mac)
- [ ] **Edge** (latest)

### Accessibility
- [ ] **Keyboard navigation** works through all elements
- [ ] **Color contrast** meets accessibility standards
- [ ] **Screen reader friendly** (test with screen reader if available)
- [ ] **Form labels** are properly associated

## 🐛 Known Issues & Fixes

### Issue: CSS Import Order Warning
**Symptom**: Console warning about @import order  
**Status**: ✅ FIXED - Moved wedding-theme.css import before Tailwind

### Issue: Color Variables Not Recognized
**Symptom**: Tailwind classes not applying wedding colors  
**Status**: ✅ FIXED - Updated tailwind.config.js with custom color palette

## 📋 Test Results Template

Copy this checklist to track your testing:

```markdown
## Test Results - [Date]

### Login Page: ⬜ Pass / ⬜ Fail
- Split-screen layout: ⬜
- Form validation: ⬜
- Wedding theme colors: ⬜
- Responsive design: ⬜

### Dashboard: ⬜ Pass / ⬜ Fail
- Welcome message: ⬜
- Pipeline funnel: ⬜
- Metric cards: ⬜
- Market insights: ⬜

### Lead Management: ⬜ Pass / ⬜ Fail
- Filtering system: ⬜
- Table functionality: ⬜
- Bulk actions: ⬜
- Responsive design: ⬜

### Overall Assessment: ⬜ Excellent / ⬜ Good / ⬜ Needs Work
```

## 🚀 Next Steps After Testing

1. **Report any issues** found during testing
2. **Suggest improvements** based on user experience
3. **Test additional features** like campaign management
4. **Performance optimization** if needed
5. **Deploy to staging** environment

## 💡 Pro Testing Tips

1. **Use Browser Dev Tools**: Press F12 to inspect elements and check console
2. **Test Mobile First**: Start with mobile view, then scale up
3. **Clear Browser Cache**: If changes don't appear, clear cache and reload
4. **Test Real Data**: Try different lead data scenarios
5. **Accessibility Testing**: Use keyboard-only navigation

---

**Happy Testing! 🎉**

If you find any issues or have suggestions, please document them for the development team.