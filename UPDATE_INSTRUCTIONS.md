# Safe update instructions for My-Portfolio

**Target:** https://github.com/SamXl-Codes/My-Portfolio

This ZIP is prepared for the repository, but no remote GitHub changes have been made.

### Recommended method: change via a pull request

1. Ensure GitHub access is authenticated and inspect the repository's default branch and current deployment settings.
2. Create a new branch (for example, `redesign/samx-approved-2026`) from the default branch. Do not overwrite the default branch immediately.
3. Preserve `.git` history and any deployment configuration you actually still need.
4. Replace the old **website application files** with the files in this ZIP. Because the new website is static HTML, any obsolete Next.js/Vite/React/Express files must be retired so the platform builds the correct site. Review changes instead of deleting unrelated documents or GitHub workflows automatically.
5. Confirm `index.html`, `styles.css`, `app.js`, and `assets/` are at the repository root and that file paths match their capitalization.
6. Check the Vercel project configuration. Select `Other` / static framework; clear any old build/output commands inherited from the prior application.
7. Preview the branch in Vercel and test navigation, project dialogs, image loading, phone layout, contact link and reduced motion.
8. Merge the PR only after confirming the preview is correct.

### Suggested commit message

`feat(portfolio): replace old site with approved responsive SAMX redesign`

### Git commands once the correct branch is checked out and the files have been reviewed

```bash
git add -A
git diff --cached --stat
git diff --cached --check
git commit -m "feat(portfolio): replace old site with approved responsive SAMX redesign"
git push -u origin redesign/samx-approved-2026
```

Note: these commands do not remove old code by themselves. The repository migration needs review because its current framework and default branch were not confirmed through public browsing.

### Privacy and content checklist

- AB Fitness must remain absent.
- Do not publish any internal lab secrets, credentials, patient/customer data or private client code.
- Confirm project case studies and any images are appropriate to publish.
- Confirm job titles, dates, skills and certification wording before making the new site public.
