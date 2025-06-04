import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';

@Component({
  selector: 'app-attachment-button',
  imports: [TreeModule, TranslatePipe],
  templateUrl: './attachment-button.component.html',
  styleUrl: './attachment-button.component.scss',
})
export class AttachmentButtonComponent {
  // start handle for drag and drop
  treeData: TreeNode[] = [];

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  // Triggered when user drops files/folders
  onDrop(event: DragEvent) {
    event.preventDefault();
    const items = event.dataTransfer?.items;
    if (!items) return;

    this.treeData = [];
    const promises: Promise<void>[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const entry = (item as any).webkitGetAsEntry();
      if (entry) {
        promises.push(this.readEntry(entry, '', this.treeData));
      }
    }

    Promise.all(promises).then(() => {
      console.log('Finished building tree');
    });
  }

  // Triggered when user selects folder using input
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    const items: any[] = Array.from(files).map((file) => ({
      fullPath: (file as any).webkitRelativePath || file.name,
      file,
    }));

    this.treeData = [];
    this.buildTreeFromFlatFiles(items);
  }

  // Build folder structure from flat file list
  buildTreeFromFlatFiles(items: { fullPath: string; file: File }[]) {
    const root: TreeNode[] = [];

    for (const item of items) {
      const parts = item.fullPath.split('/');
      let current = root;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;

        let existing = current.find((n) => n.label === part);
        if (!existing) {
          const newNode: TreeNode = {
            label: part,
            icon: isFile ? 'pi pi-file' : 'pi pi-folder',
            children: isFile ? undefined : [],
          };

          // If it's an image, generate preview
          if (isFile && item.file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
              newNode.data = {
                file: item.file,
                previewUrl: reader.result,
              };
            };
            reader.readAsDataURL(item.file);
          }

          current.push(newNode);
          existing = newNode;
        }

        if (!isFile) {
          current = existing.children!;
        }
      }
    }

    this.treeData = root;
  }

  // Recursively read dropped directory entries
  readEntry(entry: any, path: string, parent: TreeNode[]): Promise<void> {
    return new Promise((resolve) => {
      if (entry.isFile) {
        entry.file((file: File) => {
          const node: TreeNode = {
            label: file.name,
            data: file,
            icon: 'pi pi-file',
          };

          // Show image preview if it's an image
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
              node.data = {
                file,
                previewUrl: reader.result,
              };
              parent.push(node);
              resolve();
            };
            reader.readAsDataURL(file);
          } else {
            parent.push(node);
            resolve();
          }
        });
      } else if (entry.isDirectory) {
        const dirNode: TreeNode = {
          label: entry.name,
          icon: 'pi pi-folder',
          children: [],
        };
        parent.push(dirNode);

        const reader = entry.createReader();
        reader.readEntries((entries: any[]) => {
          const promises = entries.map((e) =>
            this.readEntry(e, path + entry.name + '/', dirNode.children!)
          );
          Promise.all(promises).then(() => resolve());
        });
      }
    });
  }
}
