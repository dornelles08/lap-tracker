"use client";

import { AdBanner } from "@/components/AdBanner";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { auth, db } from "@/lib/firebase";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  saveToLocalStorage,
} from "@/lib/localStorage";
import { User } from "firebase/auth";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { Flag, History, Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Lap {
  number: number;
  lapTime: number;
  totalTime: number;
}

interface Session {
  id: number;
  title: string;
  date: string;
  totalTime: number;
  laps: Lap[];
  lapCount: number;
}

export default function Home() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [title, setTitle] = useState("");
  const [history, setHistory] = useState<Session[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(0);
  const lastLapTimeRef = useRef(0);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadSessions = async () => {
      if (user) {
        // User is logged in, load from Firebase
        try {
          const q = query(collection(db, `users/${user.uid}/sessions`));
          const querySnapshot = await getDocs(q);
          const firebaseSessions: Session[] = [];
          querySnapshot.forEach((doc) => {
            firebaseSessions.push(doc.data() as Session);
          });
          setHistory(firebaseSessions);

          // Migrate local storage data to Firebase if any
          const localSessions = getFromLocalStorage<Session[]>("stopwatch-history");
          if (localSessions && localSessions.length > 0) {
            for (const session of localSessions) {
              await addDoc(collection(db, `users/${user.uid}/sessions`), session);
            }
            removeFromLocalStorage("stopwatch-history");
            console.log("Migrated local storage sessions to Firebase.");
            // Reload history after migration
            const updatedQuerySnapshot = await getDocs(q);
            const updatedFirebaseSessions: Session[] = [];
            updatedQuerySnapshot.forEach((doc) => {
              updatedFirebaseSessions.push(doc.data() as Session);
            });
            setHistory(updatedFirebaseSessions);
          }
        } catch (e) {
          console.error("Error loading sessions from Firebase: ", e);
        }
      } else {
        // User is anonymous, load from Local Storage
        const saved = getFromLocalStorage<Session[]>("stopwatch-history");
        if (saved) {
          setHistory(saved);
        }
      }
    };

    loadSessions();
  }, [user]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 51); // Performance: Increased interval
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartStop = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (laps.length > 0) {
        const finalLapTime = time - lastLapTimeRef.current;
        setLaps((prev) => [
          ...prev,
          {
            number: prev.length + 1,
            lapTime: finalLapTime,
            totalTime: time,
          },
        ]);
      }
    } else {
      setIsRunning(true);
      startTimeRef.current = Date.now() - time;
      lastLapTimeRef.current = time;
    }
  }, [isRunning, time, laps.length]);

  const handleLap = useCallback(() => {
    if (isRunning) {
      const currentTime = time;
      const lapTime = currentTime - lastLapTimeRef.current;

      setLaps((prev) => [
        ...prev,
        {
          number: prev.length + 1,
          lapTime: lapTime,
          totalTime: currentTime,
        },
      ]);

      lastLapTimeRef.current = currentTime;
    }
  }, [isRunning, time]);

  const handleReset = useCallback(async () => {
    if (time > 0 || laps.length > 0) {
      const session: Session = {
        id: Date.now(),
        title: title,
        date: new Date().toLocaleString("pt-BR"),
        totalTime: time,
        laps: laps,
        lapCount: laps.length,
      };

      const newHistory = [session, ...history].slice(0, 50);
      setHistory(newHistory);

      if (user) {
        // Save to Firebase
        try {
          await addDoc(collection(db, `users/${user.uid}/sessions`), session);
          console.log("Session saved to Firebase!");
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      } else {
        // Save to Local Storage
        saveToLocalStorage("stopwatch-history", newHistory);
      }
    }

    setIsRunning(false);
    setTime(0);
    setLaps([]);
    setTitle("");
    lastLapTimeRef.current = 0;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [time, laps, title, history, user]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    removeFromLocalStorage("stopwatch-history");
  }, []);

  const handleHistoryClick = useCallback((session: Session) => {
    setSelectedSession(session);
    setIsHistoryModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex flex-col p-2 lg:p-4 gap-2 lg:gap-4">
      <Header />
      <div className="flex flex-1 w-full gap-2 lg:gap-4">
        <aside className="hidden md:block md:w-[150px] lg:w-[200px] rounded-lg bg-muted p-4">
          <AdBanner data-ad-slot="8753873120" />
        </aside>

        <main className="flex-1 flex flex-col items-center p-2 w-full">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 w-full max-w-2xl flex flex-col md:max-h-[calc(100vh-120px-190px)]">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Cronômetro</h1>
              <Button
                onClick={() => setShowHistory(!showHistory)}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                <History className="h-5 w-5" />
              </Button>
            </div>

            {!showHistory ? (
              <div className="flex flex-col md:flex-row gap-4 overflow-hidden">
                <div className="flex-shrink-0">
                  {/* Display do tempo */}
                  <div className="text-center mb-4">
                    <Input
                      type="text"
                      placeholder="Título da sessão"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mb-2 text-center"
                    />
                    <div className="text-5xl font-mono font-bold text-gray-800 dark:text-white mb-2">
                      {formatTime(time)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {laps.length > 0 ? `Volta ${laps.length + 1}` : "Volta 1"}
                    </div>
                  </div>

                  {/* Botões de controle */}
                  <div className="flex flex-col gap-6 items-center mb-4">
                    <Button
                      onClick={handleStartStop}
                      className={`w-20 h-20 rounded-full text-lg font-bold shadow-lg transition-all duration-200 active:scale-95 ${
                        isRunning
                          ? "bg-red-500 hover:bg-red-600 text-white shadow-red-200"
                          : "bg-green-500 hover:bg-green-600 text-white shadow-green-200"
                      }`}
                    >
                      {isRunning ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="h-8 w-8 ml-1" />
                      )}
                    </Button>
                    <div className="flex gap-6">
                      <Button
                        onClick={handleLap}
                        disabled={!isRunning}
                        className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white shadow-lg transition-all duration-200 active:scale-95"
                      >
                        <Flag className="h-6 w-6" />
                      </Button>
                      <Button
                        onClick={handleReset}
                        className="w-16 h-16 rounded-full bg-gray-500 hover:bg-gray-600 text-white shadow-lg transition-all duration-200 active:scale-95"
                      >
                        <RotateCcw className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Lista de voltas */}
                <div className="flex-grow bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                    Voltas
                  </h3>
                  {laps.length > 0 ? (
                    <div className="space-y-2">
                      {laps.map((lap) => (
                        <div
                          key={lap.number}
                          className="flex justify-between items-center py-2 px-3 bg-white dark:bg-gray-600 rounded-xl"
                        >
                          <span className="font-medium text-gray-700 dark:text-gray-200">
                            #{lap.number}
                          </span>
                          <div className="text-right">
                            <div className="font-mono text-sm text-gray-800 dark:text-white">
                              {formatTime(lap.lapTime)}
                            </div>
                            <div className="font-mono text-xs text-gray-500 dark:text-gray-400">
                              Total: {formatTime(lap.totalTime)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Nenhuma volta registrada
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Tela de Histórico */
              <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Histórico</h2>
                  {history.length > 0 && (
                    <Button onClick={clearHistory} variant="destructive" size="sm">
                      Limpar
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {history.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      Nenhuma sessão salva ainda
                    </p>
                  ) : (
                    history.map((session) => (
                      <div key={session.id} className="bg-gray-50 dark:bg-gamma-700 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-bold dark:text-gray-800">
                              {session.title || "Sessão sem título"}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {session.date}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-lg font-bold text-gray-800">
                              {formatTime(session.totalTime)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {session.lapCount} voltas
                            </div>
                          </div>
                        </div>

                        {session.laps.length > 0 && (
                          <div className="space-y-1">
                            {session.laps.slice(0, 3).map((lap) => (
                              <div
                                key={lap.number}
                                className="flex justify-between text-xs text-gray-600 dark:text-gray-300"
                              >
                                <span>Volta {lap.number}</span>
                                <span className="font-mono">{formatTime(lap.lapTime)}</span>
                              </div>
                            ))}
                            {session.laps.length > 3 && (
                              <div className="text-xs text-gray-500 dark:text-ray-400 text-center">
                                +{session.laps.length - 3} voltas
                              </div>
                            )}
                          </div>
                        )}
                        <Button
                          onClick={() => handleHistoryClick(session)}
                          size="sm"
                          className="mt-2"
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {selectedSession && (
            <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedSession.title || "Sessão sem título"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedSession.date}
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-lg font-bold text-gray-800 dark:text-white">
                        {formatTime(selectedSession.totalTime)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedSession.lapCount} voltas
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedSession.laps.map((lap) => (
                      <div
                        key={lap.number}
                        className="flex justify-between items-center py-2 px-3 bg-gray-100 dark:bg-gray-600 rounded-xl"
                      >
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          #{lap.number}
                        </span>
                        <div className="text-right">
                          <div className="font-mono text-sm text-gray-800 dark:text-white">
                            {formatTime(lap.lapTime)}
                          </div>
                          <div className="font-mono text-xs text-gray-500 dark:text-gray-400">
                            Total: {formatTime(lap.totalTime)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </main>

        <aside className="hidden md:block w-[200px] rounded-lg bg-muted p-4">
          <AdBanner data-ad-slot="8753873120" />
        </aside>
      </div>

      <footer className="block rounded-lg bg-muted p-4 text-center min-h-[120px]">
        <AdBanner data-ad-slot="3313295449" />
      </footer>
    </div>
  );
}
