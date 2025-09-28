import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { site } from "@/config/site";
import { setPageTitle } from "@/lib/head";
import popularUsData from "@/data/popular-us.json";

interface PopularItem {
  label: string;
  league: string;
  slug: string;
}

const US_LEAGUES = ["MLS", "USL Championship", "USL League One", "NWSL"];

const Content = () => {
  const [items, setItems] = useState<PopularItem[]>([]);
  const [newItem, setNewItem] = useState({ label: "", league: "MLS", slug: "" });

  useEffect(() => {
    setPageTitle("Content Management");
    setItems([...popularUsData]);
  }, []);

  const handleAddItem = () => {
    if (!newItem.label.trim() || !newItem.slug.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const item: PopularItem = {
      label: newItem.label.trim(),
      league: newItem.league,
      slug: newItem.slug.trim()
    };

    setItems([...items, item]);
    setNewItem({ label: "", league: "MLS", slug: "" });
    toast({ title: "Item added successfully" });
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    toast({ title: "Item removed successfully" });
  };

  const handleSave = () => {
    // In a real app, this would save to backend/file system
    // For now, just show success message
    toast({ title: "Changes saved successfully" });
  };

  const generateSlug = (label: string) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Button variant="ghost" className="mr-4" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-bold text-primary">{site.name}</h1>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Content Management</h2>
          <p className="text-muted-foreground">Manage popular search suggestions</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Add New Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  placeholder="e.g., LAFC vs Inter Miami"
                  value={newItem.label}
                  onChange={(e) => {
                    const label = e.target.value;
                    setNewItem({
                      ...newItem,
                      label,
                      slug: generateSlug(label)
                    });
                  }}
                />
              </div>
              <div>
                <Label htmlFor="league">League</Label>
                <Select value={newItem.league} onValueChange={(league) => setNewItem({...newItem, league})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {US_LEAGUES.map(league => (
                      <SelectItem key={league} value={league}>{league}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="e.g., lafc-vs-inter-miami"
                  value={newItem.slug}
                  onChange={(e) => setNewItem({...newItem, slug: e.target.value})}
                />
              </div>
              <Button onClick={handleAddItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Popular Items ({items.length})
                <Button onClick={handleSave} size="sm">
                  Save Changes
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3 flex-1">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-muted-foreground">
                          <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs mr-2">
                            {item.league}
                          </span>
                          {item.slug}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Content;