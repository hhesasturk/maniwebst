# Manifest - Daily Manifesto Website

A beautiful, interactive manifestation website with Turkish and English language support.

## Features

- 🌍 **Bilingual Support**: Turkish (TR) and English (EN) language options
- ✨ **Interactive Elements**: Floating emoji elements with motivational messages
- 🎵 **Audio Effects**: Background music and sound effects
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🔄 **Language Persistence**: Remembers user's language preference
- 📤 **Social Sharing**: Share manifestations on social media platforms

## Language Switching

The website includes a language switcher in the top-right corner:
- **TR**: Turkish language
- **EN**: English language

The language preference is saved in localStorage and will be remembered on future visits.

## Deployment

### Git to Vercel Deployment

1. **Initialize Git Repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit with language support"
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your Git repository
   - Vercel will automatically detect it's a static HTML site

3. **Automatic Deployments**:
   - Every push to your main branch will trigger a new deployment
   - Vercel provides a unique URL for each deployment
   - You can set up a custom domain in Vercel settings

### Manual Deployment Steps

1. **Push to Git**:
   ```bash
   git add .
   git commit -m "Add language support feature"
   git push origin main
   ```

2. **Vercel will automatically**:
   - Detect the changes
   - Build and deploy the updated site
   - Provide a new deployment URL

## File Structure

```
maniwebst/
├── index.html          # Main website file with language support
├── README.md           # This documentation file
├── melody.mp3          # Background music
├── pop.mp3            # Sound effects
├── success.mp3        # Success sound
└── ses dosyaları/     # Additional audio files
```

## Language Implementation

The language system uses:
- `data-tr` and `data-en` attributes for text content
- `data-tr-placeholder` and `data-en-placeholder` for input placeholders
- JavaScript translations object for dynamic content
- localStorage for language preference persistence

## Customization

### Adding New Languages

1. Add new language translations to the `translations` object in `index.html`
2. Add corresponding `data-[lang]` attributes to HTML elements
3. Create new manifest message arrays for the language

### Modifying Content

- Update the `translations` object for text changes
- Modify the `manifestMessagesTr` and `manifestMessagesEn` arrays for new motivational messages
- Update meta tags for SEO optimization

## Browser Support

- Modern browsers with ES6 support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive Web App features supported

## Performance

- Optimized for fast loading
- Minimal JavaScript footprint
- Responsive design for all screen sizes
- Audio files are preloaded for smooth user experience

---

**Note**: This website is designed to be deployed on Vercel with automatic Git integration. Any changes pushed to the main branch will automatically update the live site at maniwebst.com. 