import { Question } from './types';

export const WINNING_SCORE = 10;
export const TOTAL_QUESTIONS_NEEDED = 30; // Pool size

export const DEFAULT_QUESTIONS: Question[] = [
  { id: '1', question: "Apa kepanjangan dari CPU?", options: ["Central Processing Unit", "Central Program Unit", "Computer Personal Unit", "Control Panel Unit"], correctAnswerIndex: 0 },
  { id: '2', question: "Manakah yang merupakan perangkat output?", options: ["Keyboard", "Mouse", "Monitor", "Scanner"], correctAnswerIndex: 2 },
  { id: '3', question: "Bilangan biner hanya terdiri dari angka?", options: ["0 dan 1", "1 dan 2", "0 sampai 9", "1 sampai 10"], correctAnswerIndex: 0 },
  { id: '4', question: "Shortkey untuk 'Copy' adalah...", options: ["Ctrl + V", "Ctrl + X", "Ctrl + C", "Ctrl + P"], correctAnswerIndex: 2 },
  { id: '5', question: "Otak dari sebuah komputer adalah...", options: ["Harddisk", "RAM", "Processor", "VGA"], correctAnswerIndex: 2 },
  { id: '6', question: "Format gambar yang mendukung transparansi adalah...", options: ["JPEG", "JPG", "PNG", "BMP"], correctAnswerIndex: 2 },
  { id: '7', question: "RAM berfungsi untuk...", options: ["Menyimpan data permanen", "Menyimpan data sementara", "Memproses grafis", "Mencetak dokumen"], correctAnswerIndex: 1 },
  { id: '8', question: "HTML adalah bahasa untuk...", options: ["Membuat Aplikasi Android", "Membuat Struktur Web", "Mengedit Video", "Mengolah Database"], correctAnswerIndex: 1 },
  { id: '9', question: "Sistem operasi open source yang populer adalah...", options: ["Windows", "MacOS", "Linux", "iOS"], correctAnswerIndex: 2 },
  { id: '10', question: "1 Byte setara dengan berapa bit?", options: ["4", "8", "16", "32"], correctAnswerIndex: 1 },
  { id: '11', question: "Perangkat lunak untuk menjelajah internet disebut...", options: ["Browser", "Explorer", "Manager", "Server"], correctAnswerIndex: 0 },
  { id: '12', question: "WWW singkatan dari...", options: ["World Wide Web", "World Web Wide", "Web World Wide", "Wide World Web"], correctAnswerIndex: 0 },
  { id: '13', question: "Algoritma biasanya digambarkan dengan...", options: ["Flowchart", "Pie Chart", "Bar Chart", "Sketsa"], correctAnswerIndex: 0 },
  { id: '14', question: "Manakah yang merupakan bahasa pemrograman?", options: ["HTML", "Python", "CSS", "HTTP"], correctAnswerIndex: 1 },
  { id: '15', question: "Penyimpanan awan disebut juga...", options: ["Rain Storage", "Cloud Storage", "Sky Drive", "Net Save"], correctAnswerIndex: 1 },
  { id: '16', question: "Wi-Fi menggunakan gelombang...", options: ["Radio", "Suara", "Air", "Magnet"], correctAnswerIndex: 0 },
  { id: '17', question: "Ekstensi file Python adalah...", options: [".py", ".pt", ".ph", ".pn"], correctAnswerIndex: 0 },
  { id: '18', question: "Ctrl + Z berfungsi untuk...", options: ["Redo", "Undo", "Cut", "Paste"], correctAnswerIndex: 1 },
  { id: '19', question: "Manakah yang BUKAN sistem operasi?", options: ["Android", "Windows", "Office", "Ubuntu"], correctAnswerIndex: 2 },
  { id: '20', question: "IP Address berfungsi sebagai...", options: ["Alamat identitas perangkat", "Penguat sinyal", "Penyimpan data", "Pendingin CPU"], correctAnswerIndex: 0 },
  { id: '21', question: "SSD singkatan dari...", options: ["Solid State Drive", "Super Speed Drive", "Solid System Disk", "Super State Disk"], correctAnswerIndex: 0 },
  { id: '22', question: "Aplikasi pengolah kata buatan Microsoft adalah...", options: ["Excel", "Word", "PowerPoint", "Access"], correctAnswerIndex: 1 },
  { id: '23', question: "Tombol 'Esc' biasanya digunakan untuk...", options: ["Masuk", "Keluar/Membatalkan", "Menyimpan", "Menghapus"], correctAnswerIndex: 1 },
  { id: '24', question: "Google Chrome adalah contoh dari...", options: ["Search Engine", "Web Browser", "Social Media", "Hardware"], correctAnswerIndex: 1 },
  { id: '25', question: "GUI singkatan dari...", options: ["Graphical User Interface", "Global User Interface", "General Unit Interface", "Graphical Unit Interconnect"], correctAnswerIndex: 0 },
  { id: '26', question: "Manakah perangkat input?", options: ["Speaker", "Microphone", "Monitor", "Printer"], correctAnswerIndex: 1 },
  { id: '27', question: "HTTP singkatan dari...", options: ["Hyper Text Transfer Protocol", "High Text Transfer Protocol", "Hyper Tech Transfer Protocol", "Hybrid Text Transfer Protocol"], correctAnswerIndex: 0 },
  { id: '28', question: "Bagian komputer yang menampilkan visual adalah...", options: ["CPU", "GPU/VGA", "PSU", "HDD"], correctAnswerIndex: 1 },
  { id: '29', question: "Sistem bilangan basis 16 disebut...", options: ["Desimal", "Biner", "Oktal", "Heksadesimal"], correctAnswerIndex: 3 },
  { id: '30', question: "Bug dalam komputer artinya...", options: ["Serangga", "Fitur", "Kesalahan Program", "Virus"], correctAnswerIndex: 2 },
];
