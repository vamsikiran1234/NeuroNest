import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getGameById } from '../../features/games/registry/gameRegistry';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Gamepad2 } from 'lucide-react';

export function GamePlayPage() {
  const { gameId } = useParams<{ gameId: string }>();

  if (!gameId) {
    return <Navigate to="/app/games" replace />;
  }

  const game = getGameById(gameId);

  if (!game) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 text-center bg-white rounded-3xl border border-border shadow-sm space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-cream-100 flex items-center justify-center text-muted-foreground">
          <Gamepad2 className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Activity Not Found</h2>
        <p className="text-xs text-muted-foreground font-reading">
          The requested game activity could not be found or has been moved.
        </p>
        <Link to="/app/games">
          <Button variant="outline" size="sm" className="mt-2">
            Return to Game Hub
          </Button>
        </Link>
      </div>
    );
  }

  const GameComponent = game.component;

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/app/games"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Game Hub
        </Link>
      </div>

      {/* Render Active Game */}
      <div className="flex justify-center">
        <GameComponent />
      </div>
    </div>
  );
}
