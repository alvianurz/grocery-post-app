"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession, signOut } from "@/lib/auth-client";
import { Loader2, LogOut, User } from "lucide-react";

export default function DashboardPage() {
    const { data: session, isPending } = useSession();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/sign-in");
        }
    }, [session, isPending, router]);

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            await signOut();
            router.push("/");
        } catch (error) {
            console.error("Sign out error:", error);
        } finally {
            setIsSigningOut(false);
        }
    };

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const userInitials = session.user.name
        ? session.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : session.user.email[0].toUpperCase();

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <Button
                        variant="outline"
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        size="sm"
                    >
                        {isSigningOut ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing out...
                            </>
                        ) : (
                            <>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign out
                            </>
                        )}
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid gap-6">
                    {/* Welcome Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback>
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-xl">
                                        Welcome back, {session.user.name || "User"}!
                                    </h2>
                                    <p className="text-muted-foreground">
                                        {session.user.email}
                                    </p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <Badge variant="secondary">
                                    <User className="mr-1 h-3 w-3" />
                                    Authenticated
                                </Badge>
                                <Badge variant="outline">
                                    ID: {session.user.id.slice(0, 8)}...
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                                <CardDescription>Your account information</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm">
                                        <span className="font-medium">Name:</span>{" "}
                                        {session.user.name || "Not set"}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">Email:</span>{" "}
                                        {session.user.email}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">Verified:</span>{" "}
                                        <Badge variant={session.user.emailVerified ? "default" : "secondary"}>
                                            {session.user.emailVerified ? "Yes" : "No"}
                                        </Badge>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Session</CardTitle>
                                <CardDescription>Current session details</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm">
                                        <span className="font-medium">Active:</span>{" "}
                                        <Badge variant="default">Yes</Badge>
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">Expires:</span>{" "}
                                        {new Date(session.expiresAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Getting Started</CardTitle>
                                <CardDescription>Next steps for your app</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm space-y-1">
                                    <li>✅ Authentication setup</li>
                                    <li>✅ User dashboard</li>
                                    <li>🔄 Customize your profile</li>
                                    <li>🔄 Build your features</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}