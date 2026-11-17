"use client";

import { useState } from "react";
import { useCampaignHref } from "@/components/lp/LpCta";
import { FillButton } from "@/components/ui/FillButton";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export interface PickerChoice {
  id: string;
  label: string;
  hint: string;
  message: string;
}

/**
 * Escolha do tipo de projeto antes do clique.
 *
 * A escolha muda duas coisas: a mensagem que o WhatsApp abre (a conversa já
 * começa dizendo o que a pessoa procura) e o `data-cm-id` do botão, que é o
 * "onde" do evento `whatsapp_click`. Assim o tipo de projeto aparece na
 * medição sem parâmetro novo e sem nenhum dado pessoal.
 *
 * São botões de rádio nativos: setas do teclado trocam a opção e o leitor de
 * tela anuncia o grupo pela `legend`.
 */
export function ContactPicker({
  choices,
  legend,
  cta,
}: {
  choices: PickerChoice[];
  legend: string;
  cta: string;
}) {
  const [selected, setSelected] = useState(choices[0].id);
  const choice = choices.find((c) => c.id === selected) ?? choices[0];
  const href = useCampaignHref(choice.message);
  const id = `lp-contato-${choice.id}`;

  return (
    <div className="cs-picker">
      <fieldset>
        <legend>{legend}</legend>
        <div className="cs-choices">
          {choices.map((c) => (
            <label key={c.id} className={c.id === selected ? "cs-choice is-on" : "cs-choice"}>
              <input
                type="radio"
                name="tipo-de-projeto"
                value={c.id}
                checked={c.id === selected}
                onChange={() => setSelected(c.id)}
              />
              <span className="cs-choice-box" aria-hidden />
              <span>
                <strong>{c.label}</strong>
                <small>{c.hint}</small>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <FillButton
        href={href}
        target="_blank"
        size="lg"
        full
        className="cs-cta"
        data-cm-role="whatsapp"
        data-cm-id={id}
        data-cm-cta={id}
      >
        <span className="cs-cta-in">
          <WhatsAppIcon />
          <span>
            {cta}
            <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
          </span>
        </span>
      </FillButton>
    </div>
  );
}
