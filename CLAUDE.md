# Website rules

- Do not change the ?v= value on the app.js link in website/index.html by hand. The deploy workflows set it to the commit being deployed: .github/workflows/deploy.yml for production, run by hand, and deploy-staging.yml for staging, on every push to main.
