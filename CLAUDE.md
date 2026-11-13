# Website rules

- Do not change the ?v= value on the app.js link in website/index.html by hand. The deploy workflow (.github/workflows/deploy.yml) sets it to the commit being deployed, on every push to main.
