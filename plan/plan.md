Ecco un piano di lavoro dettagliato per la seconda IA, strutturato per rispondere alle tue specifiche tecniche e basato sui requisiti del progetto "Water's in the Air".

### 1. Progettazione Hardware e Pin Arduino
L'IA dovrà scrivere lo sketch (C++) per Arduino impostando la seguente configurazione dei pin (standard consigliati per questo tipo di sensori):

*   **Pin Digitale 2:** Sensore di temperatura e umidità **DHT11**.
*   **Comunicazione Serial (USB):** Invio dei dati al Raspberry Pi tramite protocollo binario (usando `struct` lato Python).

### 2. Architettura Software Python
L'applicazione su Raspberry Pi fungerà da ponte tra l'hardware e l'interfaccia web. L'IA dovrà strutturare il codice Python seguendo questo schema:

*   **Modulo di Acquisizione:** Utilizzo di `pyserial` per leggere il flusso dati da Arduino e `struct` per decodificare i pacchetti binari ricevuti.
*   **Logica Temporale:** Gestione degli intervalli di campionamento differenziati: ogni **10 minuti dalle 7:30 alle 17:00** e ogni **30 minuti dalle 17:00 alle 7:30**.
*   **Web App (Flask):** Creazione di un server web che punti a una cartella denominata `/templates` per i file HTML.
*   **Gestione Dati:** Salvataggio delle letture (umidità, temperatura, timestamp e stato classe) in formato **JSON** per il web e **CSV** per l'analisi successiva in Excel, entrambi i formati devono tenere lo storico quindi i vuovi dati devono essere aggiunti ai vecchi non al posto dei vecchi.

### 3. Struttura del Progetto (Cartelle)
L'IA deve organizzare i file come segue:
```text
/project_root
│   README.md (Spiegazione progetto e funzionamento)
│   app.py (Codice Flask e logica dati)
│   data.csv (Tabella per Excel)
│   data.json (Dati storici per l'app)
├───/templates
│        index.html (Tutte le pagine utili al nostro progetto)
│        /img  (eventuale cartella con immagini utili al sito)
│        /altre_cartelle (tutto ciò che serve per il frontend)
├───/arduino  (codice completo di arduino)
│	 sketch.ino
└───/template_old  (template di riferimento per quello definitivo)
```

---

### Modifiche e Integrazioni Librerie
Ho analizzato la tua lista e ho aggiunto alcune librerie fondamentali per garantire il funzionamento del file CSV (richiesto per la tabella Excel) e della logica temporale.

| Libreria Richiesta | Stato | Note dell'Esperto |
| :--- | :--- | :--- |
| `pyserial` | Confermata | Essenziale per la comunicazione Arduino-Raspberry. |
| `struct` | Confermata | Necessaria per interpretare correttamente i dati binari. |
| `datetime` | Confermata | Fondamentale per rispettare le fasce orarie del progetto. |
| `json` | Confermata | Ottima per passare i dati al frontend della web app. |
| `flask` | Confermata | Per la gestione del framework web e dei `/templates`. |
| **`csv`** | **Aggiunta** | **Indispensabile** per generare il file leggibile da Excel con le colonne: umidità, temperatura, data e classe in uso. |
| **`time`** | **Aggiunta** | Necessaria per gestire le pause (`sleep`) tra un campionamento e l'altro. |

