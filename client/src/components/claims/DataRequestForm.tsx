import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AlertCircle, Upload, X } from 'lucide-react';
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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { DataRequestSchema, DataRequestField } from './FormBuilder';

interface DataRequestFormProps {
  schema: DataRequestSchema;
  onSubmit: (data: Record<string, unknown>, documents: string[]) => Promise<void>;
  isLoading?: boolean;
}

export function DataRequestForm({ schema, onSubmit, isLoading }: DataRequestFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (fieldName: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      // TODO: Implement actual file upload to Cloudinary
      // For now, simulate upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const urls = Array.from(files).map(
        (file) => `https://example.com/uploads/${file.name}`
      );
      
      setUploadedDocuments([...uploadedDocuments, ...urls]);
      setValue(fieldName, urls);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeDocument = (url: string) => {
    setUploadedDocuments(uploadedDocuments.filter((doc) => doc !== url));
  };

  const onFormSubmit = async (data: Record<string, unknown>) => {
    await onSubmit(data, uploadedDocuments);
  };

  const renderField = (field: DataRequestField) => {
    const fieldId = field.fieldName;

    switch (field.type) {
      case 'text':
        return (
          <Input
            id={fieldId}
            {...register(fieldId, { required: field.required })}
            placeholder={field.description}
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            {...register(fieldId, { required: field.required })}
            placeholder={field.description}
            rows={4}
          />
        );

      case 'number':
        return (
          <Input
            id={fieldId}
            type="number"
            {...register(fieldId, { required: field.required })}
            placeholder={field.description}
          />
        );

      case 'date':
        return (
          <Input
            id={fieldId}
            type="date"
            {...register(fieldId, { required: field.required })}
          />
        );

      case 'file':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                id={fieldId}
                type="file"
                multiple
                onChange={(e) => handleFileUpload(fieldId, e.target.files)}
                disabled={isUploading}
                className="hidden"
              />
              <Label
                htmlFor={fieldId}
                className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-muted transition-colors"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Choose Files'}
              </Label>
            </div>
            
            {uploadedDocuments.length > 0 && (
              <div className="space-y-1">
                {uploadedDocuments.map((url, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 border rounded-md text-sm"
                  >
                    <span className="truncate flex-1">{url.split('/').pop()}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeDocument(url)}
                      className="h-6 w-6"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'select':
        return (
          <Select onValueChange={(value) => setValue(fieldId, value)}>
            <SelectTrigger>
              <SelectValue placeholder={field.description || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-900 dark:text-amber-100">
            Action Required
          </AlertTitle>
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            The admin has requested additional information. Please fill out the form below.
          </AlertDescription>
        </Alert>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{schema.title}</h3>
            {schema.description && (
              <p className="text-sm text-muted-foreground mb-4">
                {schema.description}
              </p>
            )}
          </div>

          {schema.fields.map((field) => (
            <div key={field.fieldName} className="space-y-2">
              <Label htmlFor={field.fieldName}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              
              {field.description && field.type !== 'file' && (
                <p className="text-xs text-muted-foreground">{field.description}</p>
              )}
              
              {renderField(field)}
              
              {errors[field.fieldName] && (
                <p className="text-xs text-destructive">This field is required</p>
              )}
            </div>
          ))}

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Submitting...' : 'Submit Information'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
