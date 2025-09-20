"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Bell,
  Repeat,
  Play,
  Pause,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { GlowingButton } from "@/components/ui/GlowingButton";
import toast from "react-hot-toast";

export default function ScheduleSettingsPage() {
  const router = useRouter();
  const [scheduleItems, setScheduleItems] = useState([
    {
      id: 1,
      title: "Weekly Update",
      type: "recurring",
      date: "2025-01-15",
      time: "14:00",
      frequency: "weekly",
      enabled: true,
    },
    {
      id: 2,
      title: "Special Release",
      type: "once",
      date: "2025-02-01",
      time: "18:00",
      frequency: "once",
      enabled: true,
    },
  ]);

  const [newSchedule, setNewSchedule] = useState({
    title: "",
    type: "once",
    date: "",
    time: "",
    frequency: "once",
  });

  const addScheduleItem = () => {
    if (!newSchedule.title || !newSchedule.date || !newSchedule.time) {
      toast.error("Please fill all fields");
      return;
    }

    const newItem = {
      ...newSchedule,
      id: Date.now(),
      enabled: true,
    };

    setScheduleItems([...scheduleItems, newItem]);
    setNewSchedule({
      title: "",
      type: "once",
      date: "",
      time: "",
      frequency: "once",
    });
    toast.success("Schedule added!");
  };

  const toggleSchedule = (id: number) => {
    setScheduleItems(
      scheduleItems.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const deleteSchedule = (id: number) => {
    setScheduleItems(scheduleItems.filter((item) => item.id !== id));
    toast.success("Schedule removed");
  };

  const handleSave = () => {
    localStorage.setItem("contentSchedule", JSON.stringify(scheduleItems));
    toast.success("Schedule saved successfully!");
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Content Schedule
              </h1>
              <p className="text-gray-400">
                Plan and automate your content releases
              </p>
            </div>
          </div>

          <GlowingButton onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Schedule
          </GlowingButton>
        </div>

        {/* Add New Schedule */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Create Schedule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Title</label>
              <input
                type="text"
                value={newSchedule.title}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, title: e.target.value })
                }
                placeholder="Schedule title..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Type</label>
              <select
                value={newSchedule.type}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, type: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
              >
                <option value="once">One Time</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Date</label>
              <input
                type="date"
                value={newSchedule.date}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, date: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Time</label>
              <input
                type="time"
                value={newSchedule.time}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, time: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {newSchedule.type === "recurring" && (
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">
                  Frequency
                </label>
                <select
                  value={newSchedule.frequency}
                  onChange={(e) =>
                    setNewSchedule({
                      ...newSchedule,
                      frequency: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
          </div>

          <button
            onClick={addScheduleItem}
            className="w-full py-3 bg-purple-500 rounded-xl text-white hover:bg-purple-600 transition"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Add to Schedule
          </button>
        </div>

        {/* Schedule List */}
        <div className="glass-effect rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Scheduled Content
          </h2>

          <div className="space-y-3">
            {scheduleItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white/5 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-white font-medium">{item.title}</h3>
                      {item.type === "recurring" && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs flex items-center space-x-1">
                          <Repeat className="w-3 h-3" />
                          <span>{item.frequency}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{item.date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.time}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleSchedule(item.id)}
                      className={`p-2 rounded-lg transition ${
                        item.enabled
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {item.enabled ? (
                        <Play className="w-4 h-4" />
                      ) : (
                        <Pause className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteSchedule(item.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {scheduleItems.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No scheduled content yet</p>
                <p className="text-sm text-gray-500">
                  Create your first schedule above
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="glass-effect rounded-xl p-4">
            <Bell className="w-5 h-5 text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-white">
              {scheduleItems.filter((i) => i.enabled).length}
            </p>
            <p className="text-sm text-gray-400">Active Schedules</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <Calendar className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">
              {scheduleItems.filter((i) => i.type === "recurring").length}
            </p>
            <p className="text-sm text-gray-400">Recurring</p>
          </div>

          <div className="glass-effect rounded-xl p-4">
            <Clock className="w-5 h-5 text-green-400 mb-2" />
            <p className="text-2xl font-bold text-white">
              {scheduleItems.filter((i) => i.type === "once").length}
            </p>
            <p className="text-sm text-gray-400">One-time</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
