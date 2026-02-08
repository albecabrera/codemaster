
export const challenges = {
  'html-css': [
    {
      id: 'html-beginner-1',
      difficulty: 'Beginner',
      language: 'HTML/CSS',
      initialCode: {
        html: '<!-- Write your HTML here -->\n',
        css: '/* Write your CSS here */\n'
      },
      points: 50,
      translations: {
        en: {
          title: 'Create a Simple Heading',
          description: 'Create an h1 element with the text "Hello World" and style it with a blue color.',
          hints: ['Use the <h1> tag', 'Use color: blue in CSS', 'Target h1 selector']
        },
        de: {
          title: 'Einfache Überschrift',
          description: 'Erstelle eine h1-Überschrift mit dem Text "Hello World" und färbe sie blau.',
          hints: ['Nutze das <h1> Tag', 'Nutze color: blue im CSS', 'Nutze den h1 Selektor']
        },
        es: {
          title: 'Encabezado Simple',
          description: 'Crea un elemento h1 con el texto "Hello World" y dale color azul.',
          hints: ['Usa la etiqueta <h1>', 'Usa color: blue en CSS', 'Selecciona h1']
        }
      },
      achievement: {
        id: 'first-html',
        icon: 'Code',
        translations: {
            en: { name: 'First HTML', description: 'Completed your first HTML challenge' },
            de: { name: 'Erstes HTML', description: 'Erste HTML Herausforderung gemeistert' },
            es: { name: 'Primer HTML', description: 'Completaste tu primer reto HTML' }
        }
      }
    }
  ],
  'python': [
    {
      id: 'python-beginner-1',
      difficulty: 'Beginner',
      language: 'Python',
      initialCode: '# Write your code here\n',
      expectedOutput: 'Hello, World!',
      points: 50,
      translations: {
        en: { title: 'Hello World', description: 'Print "Hello, World!" to the console.', hints: ['Use print()'] },
        de: { title: 'Hallo Welt', description: 'Gib "Hello, World!" in der Konsole aus.', hints: ['Benutze print()'] },
        es: { title: 'Hola Mundo', description: 'Imprime "Hello, World!" en la consola.', hints: ['Usa print()'] }
      },
      achievement: {
        id: 'first-python',
        icon: 'Code2',
        translations: {
            en: { name: 'First Python', description: 'First Python program' },
            de: { name: 'Erstes Python', description: 'Erstes Python Programm' },
            es: { name: 'Primer Python', description: 'Primer programa Python' }
        }
      }
    }
  ],
  'java': [
    {
      id: 'java-beginner-1',
      difficulty: 'Beginner',
      language: 'Java',
      initialCode: 'public class Main {\n    public static void main(String[] args) {\n        // Code here\n    }\n}',
      expectedOutput: 'Hello, World!',
      points: 50,
      translations: {
        en: { title: 'Hello World', description: 'Print "Hello, World!" to console.', hints: ['System.out.println'] },
        de: { title: 'Hallo Welt', description: 'Gib "Hello, World!" aus.', hints: ['System.out.println'] },
        es: { title: 'Hola Mundo', description: 'Imprime "Hello, World!"', hints: ['System.out.println'] }
      },
      achievement: {
        id: 'first-java',
        icon: 'Coffee',
        translations: {
            en: { name: 'First Java', description: 'First Java program' },
            de: { name: 'Erstes Java', description: 'Erstes Java Programm' },
            es: { name: 'Primer Java', description: 'Primer programa Java' }
        }
      }
    }
  ],
  'javascript': [
    // Beginner
    {
      id: 'js-beg-1',
      difficulty: 'Beginner',
      language: 'JavaScript',
      initialCode: '// Declare a variable named "greeting" with value "Hello"\n// Then log it to the console\n',
      expectedOutput: 'Hello',
      points: 30,
      translations: {
        en: { title: 'Variables', description: 'Declare a variable named "greeting" containing the string "Hello" and log it.', hints: ['Use const or let', 'console.log(greeting)'] },
        de: { title: 'Variablen', description: 'Deklariere eine Variable "greeting" mit "Hello" und gib sie aus.', hints: ['Nutze const oder let', 'console.log(greeting)'] },
        es: { title: 'Variables', description: 'Declara una variable "greeting" con "Hello" e imprímela.', hints: ['Usa const o let', 'console.log(greeting)'] }
      }
    },
    {
      id: 'js-beg-2',
      difficulty: 'Beginner',
      language: 'JavaScript',
      initialCode: '// Log the sum of 10 and 20\nconsole.log();',
      expectedOutput: '30',
      points: 30,
      translations: {
        en: { title: 'Simple Math', description: 'Calculate and log the sum of 10 and 20.', hints: ['Use the + operator'] },
        de: { title: 'Einfache Mathe', description: 'Berechne und gib die Summe von 10 und 20 aus.', hints: ['Nutze den + Operator'] },
        es: { title: 'Matemáticas Simples', description: 'Calcula e imprime la suma de 10 y 20.', hints: ['Usa el operador +'] }
      }
    },
    {
      id: 'js-beg-3',
      difficulty: 'Beginner',
      language: 'JavaScript',
      initialCode: '// Create two strings: "Java" and "Script"\n// Log them joined together\n',
      expectedOutput: 'JavaScript',
      points: 40,
      translations: {
        en: { title: 'String Concatenation', description: 'Join "Java" and "Script" into one string and log it.', hints: ['Use + or template literals'] },
        de: { title: 'String Verknüpfung', description: 'Verbinde "Java" und "Script" und gib es aus.', hints: ['Nutze + oder Template Strings'] },
        es: { title: 'Concatenación', description: 'Une "Java" y "Script" e imprímelo.', hints: ['Usa + o plantillas literales'] }
      }
    },
    // Intermediate
    {
      id: 'js-int-1',
      difficulty: 'Intermediate',
      language: 'JavaScript',
      initialCode: '// Write a function "multiply" that returns a * b\nfunction multiply(a, b) {\n\n}\nconsole.log(multiply(5, 5));',
      expectedOutput: '25',
      points: 60,
      translations: {
        en: { title: 'Functions', description: 'Complete the function to multiply two numbers.', hints: ['Use return keyword', 'a * b'] },
        de: { title: 'Funktionen', description: 'Vervollständige die Funktion um zwei Zahlen zu multiplizieren.', hints: ['Nutze return', 'a * b'] },
        es: { title: 'Funciones', description: 'Completa la función para multiplicar dos números.', hints: ['Usa return', 'a * b'] }
      }
    },
    {
      id: 'js-int-2',
      difficulty: 'Intermediate',
      language: 'JavaScript',
      initialCode: '// Create an array named "colors" with "red", "green", "blue"\n// Log the second item\n',
      expectedOutput: 'green',
      points: 60,
      translations: {
        en: { title: 'Arrays', description: 'Create an array with colors and log the second element.', hints: ['Index starts at 0', 'colors[1]'] },
        de: { title: 'Arrays', description: 'Erstelle ein Array mit Farben und gib das zweite Element aus.', hints: ['Index beginnt bei 0', 'colors[1]'] },
        es: { title: 'Arrays', description: 'Crea un array con colores e imprime el segundo elemento.', hints: ['El índice empieza en 0', 'colors[1]'] }
      }
    },
    {
      id: 'js-int-3',
      difficulty: 'Intermediate',
      language: 'JavaScript',
      initialCode: '// Create an object "car" with properties: brand: "Tesla", model: "X"\n// Log the brand\n',
      expectedOutput: 'Tesla',
      points: 70,
      translations: {
        en: { title: 'Objects', description: 'Create a car object and log its brand property.', hints: ['const car = { ... }', 'car.brand'] },
        de: { title: 'Objekte', description: 'Erstelle ein Auto-Objekt und gib die Marke aus.', hints: ['const car = { ... }', 'car.brand'] },
        es: { title: 'Objetos', description: 'Crea un objeto auto e imprime su marca.', hints: ['const car = { ... }', 'car.brand'] }
      }
    },
    {
      id: 'js-int-4',
      difficulty: 'Intermediate',
      language: 'JavaScript',
      initialCode: '// Use a for loop to log numbers 1 to 3\n',
      expectedOutput: '1\n2\n3',
      points: 80,
      translations: {
        en: { title: 'Loops', description: 'Log numbers 1, 2, and 3 using a loop.', hints: ['for(let i=1; i<=3; i++)'] },
        de: { title: 'Schleifen', description: 'Gib die Zahlen 1, 2, 3 mit einer Schleife aus.', hints: ['for(let i=1; i<=3; i++)'] },
        es: { title: 'Bucles', description: 'Imprime los números 1, 2 y 3 usando un bucle.', hints: ['for(let i=1; i<=3; i++)'] }
      }
    },
    // Advanced
    {
      id: 'js-adv-1',
      difficulty: 'Expert',
      language: 'JavaScript',
      initialCode: '// Use map() to double these numbers\nconst nums = [1, 2, 3];\nconst doubled = nums.map(n => 0); // Fix this\nconsole.log(doubled);',
      expectedOutput: '[ 2, 4, 6 ]',
      points: 100,
      translations: {
        en: { title: 'Array Methods', description: 'Use .map() to create an array with doubled values.', hints: ['n => n * 2'] },
        de: { title: 'Array Methoden', description: 'Nutze .map() um Werte zu verdoppeln.', hints: ['n => n * 2'] },
        es: { title: 'Métodos de Array', description: 'Usa .map() para duplicar los valores.', hints: ['n => n * 2'] }
      }
    },
    {
      id: 'js-adv-2',
      difficulty: 'Expert',
      language: 'JavaScript',
      initialCode: '// Create a Promise that resolves to "Success" immediately\n// Use .then() to log the result\n',
      expectedOutput: 'Success',
      points: 120,
      translations: {
        en: { title: 'Promises', description: 'Create and resolve a Promise, then log the result.', hints: ['Promise.resolve("Success")', '.then(res => console.log(res))'] },
        de: { title: 'Promises', description: 'Erstelle und löse ein Promise auf, gib das Ergebnis aus.', hints: ['Promise.resolve("Success")', '.then(res => console.log(res))'] },
        es: { title: 'Promesas', description: 'Crea y resuelve una Promesa, imprime el resultado.', hints: ['Promise.resolve("Success")', '.then(res => console.log(res))'] }
      }
    },
    {
      id: 'js-adv-3',
      difficulty: 'Expert',
      language: 'JavaScript',
      initialCode: '// Async/Await: Create an async function "getData"\n// It should return "Data Loaded"\n// Call it and log the result using .then() or await\n',
      expectedOutput: 'Data Loaded',
      points: 130,
      translations: {
        en: { title: 'Async/Await', description: 'Create an async function that returns a string and log it.', hints: ['async function getData()', 'return "Data Loaded"'] },
        de: { title: 'Async/Await', description: 'Erstelle eine async Funktion und gib den Rückgabewert aus.', hints: ['async function getData()', 'return "Data Loaded"'] },
        es: { title: 'Async/Await', description: 'Crea una función async e imprime el resultado.', hints: ['async function getData()', 'return "Data Loaded"'] }
      }
    },
    {
      id: 'js-adv-4',
      difficulty: 'Expert',
      language: 'JavaScript',
      initialCode: '// Classes: Create a class "Dog" with method "bark" returning "Woof"\nconst d = new Dog();\nconsole.log(d.bark());',
      expectedOutput: 'Woof',
      points: 140,
      translations: {
        en: { title: 'Classes', description: 'Define a class Dog with a bark method.', hints: ['class Dog { bark() { return "Woof"; } }'] },
        de: { title: 'Klassen', description: 'Definiere eine Klasse Dog mit einer bark Methode.', hints: ['class Dog { bark() { return "Woof"; } }'] },
        es: { title: 'Clases', description: 'Define una clase Dog con un método bark.', hints: ['class Dog { bark() { return "Woof"; } }'] }
      }
    },
    {
      id: 'js-adv-5',
      difficulty: 'Expert',
      language: 'JavaScript',
      initialCode: '// Error Handling: Wrap code in try/catch\n// Throw an error "Oops"\n// Log the error message in catch block\n',
      expectedOutput: 'Oops',
      points: 150,
      translations: {
        en: { title: 'Error Handling', description: 'Throw and catch an error, logging only the message.', hints: ['throw new Error("Oops")', 'catch(e) { console.log(e.message) }'] },
        de: { title: 'Fehlerbehandlung', description: 'Wirf und fange einen Fehler, gib nur die Nachricht aus.', hints: ['throw new Error("Oops")', 'catch(e) { console.log(e.message) }'] },
        es: { title: 'Manejo de Errores', description: 'Lanza y captura un error, imprime solo el mensaje.', hints: ['throw new Error("Oops")', 'catch(e) { console.log(e.message) }'] }
      }
    }
  ]
};

export const getChallengesByLanguage = (language) => {
  return challenges[language] || [];
};

export const getChallengeById = (id) => {
  for (const language in challenges) {
    const challenge = challenges[language].find(c => c.id === id);
    if (challenge) return challenge;
  }
  return null;
};
