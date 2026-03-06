export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-white/5 rounded-sm p-8">
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">Operations Portal</h1>
        <p className="text-text-secondary text-sm mb-8">Sign in to access your dashboard</p>

        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-text-secondary mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-base border border-white/10 rounded-sm px-4 py-3 text-text-primary focus:outline-none focus:border-brand-accent/50"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-text-secondary mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-base border border-white/10 rounded-sm px-4 py-3 text-text-primary focus:outline-none focus:border-brand-accent/50"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white py-3 font-bold text-sm uppercase tracking-wider transition-all"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
