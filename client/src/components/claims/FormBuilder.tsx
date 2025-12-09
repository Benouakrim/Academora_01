import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

export interface DataRequestField {
  fieldName: string;
  label: string;
  type: 'text' | 'number' | 'file' | 'date' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
  description?: string;
}

export interface DataRequestSchema {
  title: string;
  description?: string;
  fields: DataRequestField[];
}

interface FormBuilderProps {
  onSubmit: (schema: DataRequestSchema) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function FormBuilder({ onSubmit, onCancel, isLoading }: FormBuilderProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<DataRequestField[]>([]);

  const addField = () => {
    setFields([
      ...fields,
      {
        fieldName: `field_${Date.now()}`,
        label: '',
        type: 'text',
        required: false,
        description: '',
      },
    ]);
  };

  const updateField = (index: number, updates: Partial<DataRequestField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim() || fields.length === 0) {
      alert('Please provide a title and at least one field');
      return;
    }

    const hasInvalidFields = fields.some((f) => !f.label.trim());
    if (hasInvalidFields) {
      alert('All fields must have a label');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      fields,
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Create Document Request Form</h3>
        <p className="text-sm text-muted-foreground">
          Build a custom form to request specific information from the user.
        </p>
      </div>

      {/* Form Title */}
      <div className="space-y-2">
        <Label htmlFor="form-title">Form Title *</Label>
        <Input
          id="form-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Additional Verification Documents"
        />
      </div>

      {/* Form Description */}
      <div className="space-y-2">
        <Label htmlFor="form-description">Description (Optional)</Label>
        <Textarea
          id="form-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide context about what you're requesting..."
          rows={2}
        />
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Form Fields</Label>
          <Button onClick={addField} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            No fields yet. Click "Add Field" to start building your form.
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground mt-2 cursor-move" />

                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Field Label *</Label>
                        <Input
                          value={field.label}
                          onChange={(e) =>
                            updateField(index, { label: e.target.value })
                          }
                          placeholder="e.g., Tax ID Document"
                          size={1}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Field Type</Label>
                        <Select
                          value={field.type}
                          onValueChange={(value: DataRequestField['type']) =>
                            updateField(index, { type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="textarea">Long Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="file">File Upload</SelectItem>
                            <SelectItem value="select">Dropdown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={field.description || ''}
                        onChange={(e) =>
                          updateField(index, { description: e.target.value })
                        }
                        placeholder="Help text for this field..."
                        size={1}
                      />
                    </div>

                    {field.type === 'select' && (
                      <div className="space-y-1">
                        <Label className="text-xs">Options (comma-separated)</Label>
                        <Input
                          value={field.options?.join(', ') || ''}
                          onChange={(e) =>
                            updateField(index, {
                              options: e.target.value
                                .split(',')
                                .map((o) => o.trim())
                                .filter(Boolean),
                            })
                          }
                          placeholder="Option 1, Option 2, Option 3"
                          size={1}
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`required-${index}`}
                        checked={field.required}
                        onCheckedChange={(checked) =>
                          updateField(index, { required: !!checked })
                        }
                      />
                      <Label
                        htmlFor={`required-${index}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        Required field
                      </Label>
                    </div>
                  </div>

                  <Button
                    onClick={() => removeField(index)}
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button onClick={onCancel} variant="outline" disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Request to User'}
        </Button>
      </div>
    </Card>
  );
}
