import { Component, inject } from '@angular/core';
import { SelectChangeEvent } from 'primeng/select';
import { MyTranslationService } from '../../../../core/services/myTranslation/my-translation.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ILanguage } from '../../../interfaces/ilanguage';
import { Select } from 'primeng/select';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-language-button',
  imports: [Select, ReactiveFormsModule, TranslatePipe],
  templateUrl: './language-button.component.html',
  styleUrl: './language-button.component.scss',
})
export class LanguageButtonComponent {
  private readonly myTranslationService = inject(MyTranslationService);
  formGroup!: FormGroup;
  languages: ILanguage[] = [
    { name: 'En', code: 'En' },
    { name: 'Ar', code: 'Ar' },
  ];

  constructor() {
    this.initMyForm();
  }

  initMyForm(): void {
    this.formGroup = new FormGroup({
      selectedLanguage: new FormControl<ILanguage | null>(null),
    });
  }

  // for handle the Button to change the form language (English and Arabic)
  change(lang: SelectChangeEvent) {
    const selectedLang = lang.value.code.toLowerCase();
    this.myTranslationService.changeLang(selectedLang);
  }
}
