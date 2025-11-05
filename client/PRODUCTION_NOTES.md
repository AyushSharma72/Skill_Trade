# Frontend Production Hardening Notes

Changes made automatically:
- Moved app/pages/components into src/
- Added jsconfig.json and Next webpack alias '@' => './src'
- Added basic ESLint and Prettier configs
- Removed console.log occurrences (commented out)
- Converted simple <img src="/..."> to Next.js Image components where detected
- Replaced some heavy static imports (chart.js, lottie, tensorflow) with dynamic imports using next/dynamic (ssr: false)

Manual follow-ups recommended:
- Review files with Image replacements — adjust width/height props per Next/Image requirements.
- Run `npm --prefix ./client install` then `npm --prefix ./client run dev` and fix any runtime errors.
- Run eslint and prettier locally and tune rules.
- Consider converting critical files to TypeScript for stronger guarantees.

