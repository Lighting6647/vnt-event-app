import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'เกิดข้อผิดพลาดในการแสดงผล' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-md mx-auto my-12 p-6 rounded-2xl bg-zinc-900 border border-white/10 text-center space-y-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center mx-auto font-bold">
            !
          </div>
          <h3 className="text-base font-bold text-white">ระบบตรวจพบข้อผิดพลาดชั่วคราว</h3>
          <p className="text-xs text-zinc-400">{this.state.errorMessage}</p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => this.setState({ hasError: false, errorMessage: '' })}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold active:scale-[0.98] transition-all cursor-pointer"
            >
              โหลดส่วนแสดงผลใหม่
            </button>
            <button
              onClick={() => {
                try {
                  localStorage.removeItem('tour_participants_data');
                } catch {}
                window.location.reload();
              }}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold active:scale-[0.98] transition-all cursor-pointer"
            >
              ล้างแคชและเริ่มใหม่
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
