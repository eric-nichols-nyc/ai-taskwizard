import { Settings, Upload, Trash2, LogOut, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@turbo-with-tailwind-v4/design-system/card"
import { Avatar, AvatarFallback } from "@turbo-with-tailwind-v4/design-system/avatar"

export function SettingsPage() {
  return (
    <div className="min-h-screen bg-app">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-accent" />
          <div>
            <h1 className="text-3xl font-bold text-primary">Settings</h1>
            <p className="text-secondary mt-1">Manage your account settings and preferences</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Picture Section */}
          <Card className="settings-card">
            <CardHeader>
              <CardTitle className="text-primary">Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="w-16 h-16 bg-teal-500">
                <AvatarFallback className="bg-teal-500 text-white text-xl font-semibold">E</AvatarFallback>
              </Avatar>
              <div className="flex gap-3">
                <button className="settings-button-secondary flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </button>
                <button className="settings-button-destructive flex items-center">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details Section */}
          <Card className="settings-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-primary">Profile Details</CardTitle>
              <button className="settings-button-secondary flex items-center">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-secondary block mb-2">Name</label>
                <div className="settings-input">Eric Nichols</div>
              </div>
              <div>
                <label className="text-sm text-secondary block mb-2">
                  Email <span className="text-muted">(Managed by Google)</span>
                </label>
                <div className="settings-input">ebn646@gmail.com</div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions Section */}
          <Card className="settings-card">
            <CardHeader>
              <CardTitle className="text-primary">Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="settings-button-secondary w-full justify-start flex items-center">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
              <button className="settings-button-destructive w-full justify-start flex items-center">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account...
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
