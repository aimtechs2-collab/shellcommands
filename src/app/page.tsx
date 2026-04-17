'use client'

import { useState, useEffect } from 'react'
import { Search, Terminal, BookOpen, Zap, Brain, Copy, Check, ArrowRight, Filter, Menu, X, FileText, Cpu, Network, Code, Star, Award, Play, RefreshCw, CheckCircle, Circle, ExternalLink, Clock, TrendingUp, Bookmark, Target } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface Command {
  id: string
  name: string
  description: string
  syntax: string
  examples: string[]
  category: CommandCategory
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tips: string[]
}

type CommandCategory = 'basics' | 'files' | 'text' | 'process' | 'network' | 'system' | 'scripting'

interface LearningPath {
  id: string
  title: string
  description: string
  icon: any
  commands: string[]
  estimatedTime: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  commandId?: string
  category: CommandCategory
}

interface Resource {
  id: string
  title: string
  description: string
  url: string
  category: string
}

type View = 'home' | 'curriculum' | 'practice' | 'resources'

const categories = [
  { id: 'basics' as CommandCategory, name: 'Basics', icon: Terminal, description: 'Essential commands for beginners' },
  { id: 'files' as CommandCategory, name: 'File Operations', icon: FileText, description: 'Navigate and manage files' },
  { id: 'text' as CommandCategory, name: 'Text Processing', icon: BookOpen, description: 'Process and transform text' },
  { id: 'process' as CommandCategory, name: 'Process Management', icon: Cpu, description: 'Manage system processes' },
  { id: 'network' as CommandCategory, name: 'Network', icon: Network, description: 'Network diagnostics and tools' },
  { id: 'system' as CommandCategory, name: 'System Info', icon: Zap, description: 'Get system information' },
  { id: 'scripting' as CommandCategory, name: 'Shell Scripting', icon: Code, description: 'Advanced scripting concepts' },
]

const learningPaths: LearningPath[] = [
  {
    id: 'beginner-path',
    title: 'Shell Basics Mastery',
    description: 'Start your journey with essential commands. Learn to navigate, view files, and understand the shell environment.',
    icon: Terminal,
    commands: ['pwd', 'ls', 'cd', 'clear', 'history'],
    estimatedTime: '30 minutes',
    difficulty: 'beginner'
  },
  {
    id: 'file-operations',
    title: 'File Operations Pro',
    description: 'Master file and directory management. Create, copy, move, and delete files with confidence.',
    icon: FileText,
    commands: ['mkdir', 'rmdir', 'touch', 'cp', 'mv', 'rm', 'find'],
    estimatedTime: '45 minutes',
    difficulty: 'beginner'
  },
  {
    id: 'text-processing',
    title: 'Text Processing Ninja',
    description: 'Transform and analyze text like a pro. Learn grep, sed, awk, and more for powerful text manipulation.',
    icon: BookOpen,
    commands: ['cat', 'less', 'head', 'tail', 'grep', 'sed', 'awk', 'sort', 'uniq', 'wc', 'diff'],
    estimatedTime: '1 hour',
    difficulty: 'intermediate'
  },
  {
    id: 'process-management',
    title: 'Process Management Expert',
    description: 'Control and monitor system processes effectively. Learn about background jobs, process control, and more.',
    icon: Cpu,
    commands: ['ps', 'top', 'htop', 'kill', 'killall', 'pkill', 'bg', 'fg', 'jobs', 'nohup', 'screen', 'tmux'],
    estimatedTime: '1 hour',
    difficulty: 'intermediate'
  },
  {
    id: 'network-commands',
    title: 'Network Operations',
    description: 'Diagnose and troubleshoot network issues. Master ping, curl, SSH, and network analysis tools.',
    icon: Network,
    commands: ['ping', 'curl', 'wget', 'ssh', 'scp', 'ifconfig', 'ip', 'netstat', 'ss', 'traceroute', 'nslookup', 'dig'],
    estimatedTime: '1.5 hours',
    difficulty: 'intermediate'
  },
  {
    id: 'system-admin',
    title: 'System Administration',
    description: 'Advanced system monitoring and administration. Understand system resources, logs, and service management.',
    icon: Zap,
    commands: ['uname', 'df', 'du', 'free', 'uptime', 'w', 'whoami', 'id', 'lsof', 'systemctl', 'journalctl'],
    estimatedTime: '1.5 hours',
    difficulty: 'intermediate'
  },
  {
    id: 'shell-scripting',
    title: 'Shell Scripting Master',
    description: 'Automate tasks with shell scripting. Learn variables, conditions, loops, and create powerful scripts.',
    icon: Code,
    commands: ['echo', 'read', 'export', 'alias', 'source', 'chmod', 'chown', 'test', 'crontab'],
    estimatedTime: '2 hours',
    difficulty: 'advanced'
  }
]

const quizQuestions: QuizQuestion[] = [
  // BASICS Category - 15 questions
  {
    id: 'basics-1',
    question: 'Which command is used to display the current working directory?',
    options: ['ls', 'pwd', 'cd', 'dir'],
    correctAnswer: 1,
    explanation: 'pwd (Print Working Directory) shows your current location in the filesystem.',
    commandId: 'pwd',
    category: 'basics'
  },
  {
    id: 'basics-2',
    question: 'What does the -l flag do when used with the ls command?',
    options: ['Lists hidden files', 'Shows detailed information', 'Recursive listing', 'Sorts by size'],
    correctAnswer: 1,
    explanation: 'The -l flag displays files in long format with detailed information including permissions, owner, size, and modification time.',
    commandId: 'ls',
    category: 'basics'
  },
  {
    id: 'basics-3',
    question: 'Which command is used to create a new directory?',
    options: ['create', 'newdir', 'mkdir', 'makedir'],
    correctAnswer: 2,
    explanation: 'mkdir (Make Directory) is used to create new directories.',
    commandId: 'mkdir',
    category: 'basics'
  },
  {
    id: 'basics-4',
    question: 'How do you navigate to the parent directory?',
    options: ['cd ..', 'cd parent', 'cd up', 'cd /'],
    correctAnswer: 0,
    explanation: '.. represents the parent directory, so cd .. navigates up one level.',
    commandId: 'cd',
    category: 'basics'
  },
  {
    id: 'basics-5',
    question: 'What symbol represents your home directory in Linux?',
    options: ['/', '..', '~'],
    correctAnswer: 2,
    explanation: 'The tilde (~) represents your home directory (e.g., /home/username).',
    commandId: 'cd',
    category: 'basics'
  },
  {
    id: 'basics-6',
    question: 'Which command displays your command history?',
    options: ['log', 'history', 'past', 'recall'],
    correctAnswer: 1,
    explanation: 'The history command shows previously executed commands.',
    commandId: 'history',
    category: 'basics'
  },
  {
    id: 'basics-7',
    question: 'How do you re-execute the last command from history?',
    options: ['!!', '!last', '!!last', '!last'],
    correctAnswer: 0,
    explanation: '!! is a shortcut that re-executes the last command from history.',
    commandId: 'history',
    category: 'basics'
  },
  {
    id: 'basics-8',
    question: 'What does the -a flag do with ls command?',
    options: ['Shows all files including hidden', 'Lists in alphabetical order', 'Shows file sizes', 'Displays file permissions'],
    correctAnswer: 0,
    explanation: 'The -a flag shows all files, including hidden files that start with a dot (.).',
    commandId: 'ls',
    category: 'basics'
  },
  {
    id: 'basics-9',
    question: 'Which keyboard shortcut clears the terminal screen?',
    options: ['Ctrl+C', 'Ctrl+L', 'Ctrl+D', 'Ctrl+K'],
    correctAnswer: 1,
    explanation: 'Ctrl+L clears the terminal screen, equivalent to the clear command.',
    commandId: 'clear',
    category: 'basics'
  },
  {
    id: 'basics-10',
    question: 'How do you search through command history?',
    options: ['Ctrl+F', 'Ctrl+R', 'Ctrl+H', 'Ctrl+S'],
    correctAnswer: 1,
    explanation: 'Ctrl+R opens reverse search mode in command history.',
    commandId: 'history',
    category: 'basics'
  },
  {
    id: 'basics-11',
    question: 'What does the single dot (.) represent in file paths?',
    options: ['Parent directory', 'Current directory', 'Root directory', 'Home directory'],
    correctAnswer: 1,
    explanation: 'The single dot (.) represents the current directory.',
    commandId: 'cd',
    category: 'basics'
  },
  {
    id: 'basics-12',
    question: 'How do you go to your home directory using cd?',
    options: ['cd home', 'cd /', 'cd ~', 'cd .'],
    correctAnswer: 2,
    explanation: 'cd ~ navigates to your home directory. The tilde (~) is a shortcut for your home path.',
    commandId: 'cd',
    category: 'basics'
  },
  {
    id: 'basics-13',
    question: 'What does the -h flag do with ls command?',
    options: ['Shows hidden files', 'Human-readable sizes', 'Shows file hierarchy', 'Displays file type'],
    correctAnswer: 1,
    explanation: 'The -h flag displays file sizes in human-readable format (KB, MB, GB).',
    commandId: 'ls',
    category: 'basics'
  },
  {
    id: 'basics-14',
    question: 'How do you execute command number 100 from history?',
    options: ['history 100', '!100', 'run 100', 'exec 100'],
    correctAnswer: 1,
    explanation: '!100 executes the command at position 100 in your history.',
    commandId: 'history',
    category: 'basics'
  },
  {
    id: 'basics-15',
    question: 'What command switches to the previous directory you were in?',
    options: ['cd back', 'cd -', 'cd prev', 'cd --'],
    correctAnswer: 1,
    explanation: 'cd - switches to the previous working directory (stored in OLDPWD).',
    commandId: 'cd',
    category: 'basics'
  },

  // FILE OPERATIONS Category - 15 questions
  {
    id: 'files-1',
    question: 'Which flag makes rm command remove directories recursively?',
    options: ['-d', '-r', '-f', '-a'],
    correctAnswer: 1,
    explanation: 'The -r (recursive) flag allows rm to remove directories and their contents.',
    commandId: 'rm',
    category: 'files'
  },
  {
    id: 'files-2',
    question: 'Which command is used to copy files?',
    options: ['cp', 'copy', 'mv', 'duplicate'],
    correctAnswer: 0,
    explanation: 'cp (copy) is used to copy files and directories.',
    commandId: 'cp',
    category: 'files'
  },
  {
    id: 'files-3',
    question: 'What does mkdir -p do?',
    options: ['Creates parent directories if needed', 'Makes directory private', 'Creates permissions', 'Prints directory name'],
    correctAnswer: 0,
    explanation: 'The -p flag creates parent directories as needed, avoiding "directory not found" errors.',
    commandId: 'mkdir',
    category: 'files'
  },
  {
    id: 'files-4',
    question: 'Which command moves or renames files?',
    options: ['mv', 'ren', 'move', 'rename'],
    correctAnswer: 0,
    explanation: 'mv (move) is used to both move and rename files and directories.',
    commandId: 'mv',
    category: 'files'
  },
  {
    id: 'files-5',
    question: 'What does rm -f do?',
    options: ['Fast removal', 'Force removal without prompts', 'Removes files only', 'Finds files'],
    correctAnswer: 1,
    explanation: 'The -f flag forces removal without prompting for confirmation.',
    commandId: 'rm',
    category: 'files'
  },
  {
    id: 'files-6',
    question: 'Which command searches for files by name?',
    options: ['search', 'locate', 'find', 'scan'],
    correctAnswer: 2,
    explanation: 'find searches for files in a directory hierarchy based on various criteria.',
    commandId: 'find',
    category: 'files'
  },
  {
    id: 'files-7',
    question: 'What does cp -p preserve?',
    options: ['Path information', 'Permissions and timestamps', 'Parent directories', 'Partition'],
    correctAnswer: 1,
    explanation: 'The -p flag preserves file permissions, ownership, and timestamps.',
    commandId: 'cp',
    category: 'files'
  },
  {
    id: 'files-8',
    question: 'Which command removes only empty directories?',
    options: ['rmdir', 'rm -e', 'deldir', 'rmd'],
    correctAnswer: 0,
    explanation: 'rmdir (remove directory) only removes empty directories.',
    commandId: 'rmdir',
    category: 'files'
  },
  {
    id: 'files-9',
    question: 'What flag with cp copies directories recursively?',
    options: ['-r', '-R', '-d', '-a'],
    correctAnswer: 0,
    explanation: 'The -r flag recursively copies directories and their contents.',
    commandId: 'cp',
    category: 'files'
  },
  {
    id: 'files-10',
    question: 'What command creates empty files or updates timestamps?',
    options: ['new', 'touch', 'create', 'mkfile'],
    correctAnswer: 1,
    explanation: 'touch creates empty files or updates access/modification times of existing files.',
    commandId: 'touch',
    category: 'files'
  },
  {
    id: 'files-11',
    question: 'What does find -name "*.txt" do?',
    options: ['Finds text files only', 'Finds files ending in .txt', 'Finds files named txt', 'Finds all files'],
    correctAnswer: 1,
    explanation: 'The -name "*.txt" pattern matches files ending with .txt extension.',
    commandId: 'find',
    category: 'files'
  },
  {
    id: 'files-12',
    question: 'What does mv -n prevent?',
    options: ['Navigation', 'Overwriting existing files', 'New directories', 'Notification'],
    correctAnswer: 1,
    explanation: 'The -n flag prevents overwriting existing files.',
    commandId: 'mv',
    category: 'files'
  },
  {
    id: 'files-13',
    question: 'What does ln -s create?',
    options: ['Short link', 'System link', 'Symbolic link', 'Source link'],
    correctAnswer: 2,
    explanation: 'The -s flag creates symbolic (soft) links instead of hard links.',
    commandId: 'ln',
    category: 'files'
  },
  {
    id: 'files-14',
    question: 'What is the difference between hard links and symbolic links?',
    options: ['They are identical', 'Hard links share inode, symlinks point to path', 'Symlinks are faster', 'Hard links can cross filesystems'],
    correctAnswer: 1,
    explanation: 'Hard links share the same inode (data), while symbolic links point to the file path and can cross filesystems.',
    commandId: 'ln',
    category: 'files'
  },
  {
    id: 'files-15',
    question: 'What does find -mtime -7 find?',
    options: ['Files modified in last 7 days', 'Files created 7 days ago', 'Files with 7 modifications', 'Files of size 7KB'],
    correctAnswer: 0,
    explanation: 'The -mtime -7 finds files modified within the last 7 days.',
    commandId: 'find',
    category: 'files'
  },

  // TEXT PROCESSING Category - 15 questions
  {
    id: 'text-1',
    question: 'What does grep do?',
    options: ['Copies files', 'Searches for text patterns', 'Formats text', 'Compresses files'],
    correctAnswer: 1,
    explanation: 'grep searches for text patterns in files and displays matching lines.',
    commandId: 'grep',
    category: 'text'
  },
  {
    id: 'text-2',
    question: 'Which flag makes grep case-insensitive?',
    options: ['-c', '-i', '-n', '-v'],
    correctAnswer: 1,
    explanation: 'The -i flag makes grep ignore case differences.',
    commandId: 'grep',
    category: 'text'
  },
  {
    id: 'text-3',
    question: 'What does grep -n show?',
    options: ['Number of matches', 'Line numbers', 'Next match', 'Normal mode'],
    correctAnswer: 1,
    explanation: 'The -n flag shows line numbers where matches occur.',
    commandId: 'grep',
    category: 'text'
  },
  {
    id: 'text-4',
    question: 'What does cat -n do?',
    options: ['Shows number of lines', 'Shows line numbers', 'Creates new file', 'Normal display'],
    correctAnswer: 1,
    explanation: 'The -n flag displays line numbers for each line of output.',
    commandId: 'cat',
    category: 'text'
  },
  {
    id: 'text-5',
    question: 'Which command is better for viewing large files?',
    options: ['cat', 'less', 'head', 'tail'],
    correctAnswer: 1,
    explanation: 'less allows paging and scrolling through large files, unlike cat which dumps everything.',
    commandId: 'less',
    category: 'text'
  },
  {
    id: 'text-6',
    question: 'What does head -n 20 display?',
    options: ['First 20 bytes', 'First 20 characters', 'First 20 lines', '20 files'],
    correctAnswer: 2,
    explanation: 'head -n 20 displays the first 20 lines of a file.',
    commandId: 'head',
    category: 'text'
  },
  {
    id: 'text-7',
    question: 'What does tail -f do?',
    options: ['Finds files', 'Follows file as it grows', 'Shows first lines', 'Formats text'],
    correctAnswer: 1,
    explanation: 'The -f flag makes tail follow the file in real-time as new lines are added.',
    commandId: 'tail',
    category: 'text'
  },
  {
    id: 'text-8',
    question: 'What does sed s/old/new/g do?',
    options: ['Substitutes first occurrence', 'Substitutes all occurrences', 'Shows differences', 'Sorts text'],
    correctAnswer: 1,
    explanation: 'The g flag makes sed substitute all occurrences of "old" with "new" globally.',
    commandId: 'sed',
    category: 'text'
  },
  {
    id: 'text-9',
    question: 'What does sort -n do?',
    options: ['Sorts alphabetically', 'Sorts numerically', 'Sorts backwards', 'Sorts by name'],
    correctAnswer: 1,
    explanation: 'The -n flag sorts lines numerically instead of alphabetically.',
    commandId: 'sort',
    category: 'text'
  },
  {
    id: 'text-10',
    question: 'What does awk $1 represent?',
    options: ['First character', 'First line', 'First column/field', 'First word'],
    correctAnswer: 2,
    explanation: 'In awk, $1 represents the first column or field of each line.',
    commandId: 'awk',
    category: 'text'
  },
  {
    id: 'text-11',
    question: 'What does uniq -c show?',
    options: ['Unique characters', 'Count of duplicates', 'Complete list', 'Compressed output'],
    correctAnswer: 1,
    explanation: 'The -c flag prefixes each line with the number of occurrences.',
    commandId: 'uniq',
    category: 'text'
  },
  {
    id: 'text-12',
    question: 'What does wc -l count?',
    options: ['Lines', 'Words', 'Characters', 'Bytes'],
    correctAnswer: 0,
    explanation: 'The -l flag counts the number of lines in a file.',
    commandId: 'wc',
    category: 'text'
  },
  {
    id: 'text-13',
    question: 'What does diff -u produce?',
    options: ['Brief output', 'Unified format', 'Side by side', 'Context format'],
    correctAnswer: 1,
    explanation: 'The -u flag produces unified diff format, which is more compact.',
    commandId: 'diff',
    category: 'text'
  },
  {
    id: 'text-14',
    question: 'What does grep -v do?',
    options: ['Verbose output', 'Version info', 'Inverts match (non-matching lines)', 'Visual mode'],
    correctAnswer: 2,
    explanation: 'The -v flag displays lines that do NOT match the pattern.',
    commandId: 'grep',
    category: 'text'
  },
  {
    id: 'text-15',
    question: 'What flag with awk sets the field separator?',
    options: ['-s', '-F', '-d', '-t'],
    correctAnswer: 1,
    explanation: 'The -F flag sets the field separator (e.g., -F: for colon-separated values).',
    commandId: 'awk',
    category: 'text'
  },

  // PROCESS MANAGEMENT Category - 12 questions
  {
    id: 'process-1',
    question: 'Which command shows running processes?',
    options: ['show', 'proc', 'ps', 'list'],
    correctAnswer: 2,
    explanation: 'ps (Process Status) displays information about active processes.',
    commandId: 'ps',
    category: 'process'
  },
  {
    id: 'process-2',
    question: 'What does ps aux show?',
    options: ['All processes of all users', 'Only your processes', 'System processes only', 'Detailed format'],
    correctAnswer: 0,
    explanation: 'aux shows all processes for all users with detailed information.',
    commandId: 'ps',
    category: 'process'
  },
  {
    id: 'process-3',
    question: 'What signal does kill -9 send?',
    options: ['SIGTERM', 'SIGKILL', 'SIGINT', 'SIGHUP'],
    correctAnswer: 1,
    explanation: '-9 sends SIGKILL, which force terminates the process without cleanup.',
    commandId: 'kill',
    category: 'process'
  },
  {
    id: 'process-4',
    question: 'How do you bring a background job to foreground?',
    options: ['bg job', 'fg job', 'bring job', 'front job'],
    correctAnswer: 1,
    explanation: 'fg (foreground) brings a background job to the foreground.',
    commandId: 'fg',
    category: 'process'
  },
  {
    id: 'process-5',
    question: 'What does Ctrl+Z do to a running process?',
    options: ['Kills it', 'Suspends it', 'Backgrounds it', 'Restarts it'],
    correctAnswer: 1,
    explanation: 'Ctrl+Z suspends (pauses) the current foreground process.',
    commandId: 'bg',
    category: 'process'
  },
  {
    id: 'process-6',
    question: 'What does jobs command display?',
    options: ['All system processes', 'Background jobs in current shell', 'Running applications', 'CPU jobs'],
    correctAnswer: 1,
    explanation: 'jobs shows background and suspended jobs in the current shell session.',
    commandId: 'jobs',
    category: 'process'
  },
  {
    id: 'process-7',
    question: 'What does nohup command do?',
    options: ['Hang up process', 'Makes process immune to hangups', 'Speeds up process', 'Normalizes output'],
    correctAnswer: 1,
    explanation: 'nohup allows a process to continue running after you log out (immune to hangup signal).',
    commandId: 'nohup',
    category: 'process'
  },
  {
    id: 'process-8',
    question: 'What is the prefix key for tmux commands?',
    options: ['Ctrl+A', 'Ctrl+B', 'Ctrl+C', 'Ctrl+D'],
    correctAnswer: 1,
    explanation: 'Ctrl+B is the default prefix key in tmux (terminal multiplexer).',
    commandId: 'tmux',
    category: 'process'
  },
  {
    id: 'process-9',
    question: 'What does htop offer over top?',
    options: ['Faster execution', 'Mouse support and colors', 'More processes', 'Different sort'],
    correctAnswer: 1,
    explanation: 'htop provides mouse support, colors, and more interactive features than top.',
    commandId: 'htop',
    category: 'process'
  },
  {
    id: 'process-10',
    question: 'How do you detach from a screen session?',
    options: ['Ctrl+D', 'Ctrl+A then D', 'Ctrl+Z', 'exit'],
    correctAnswer: 1,
    explanation: 'Press Ctrl+A then D to detach from a screen session.',
    commandId: 'screen',
    category: 'process'
  },
  {
    id: 'process-11',
    question: 'What does killall do?',
    options: ['Kills all processes', 'Kills processes by name', 'Lists all processes', 'Kills system daemons'],
    correctAnswer: 1,
    explanation: 'killall terminates all processes with the given name.',
    commandId: 'killall',
    category: 'process'
  },
  {
    id: 'process-12',
    question: 'What does pkill -f match?',
    options: ['First process only', 'Full command line', 'File path', 'Function name'],
    correctAnswer: 1,
    explanation: 'The -f flag makes pkill match against the full command line.',
    commandId: 'pkill',
    category: 'process'
  },

  // NETWORK Category - 12 questions
  {
    id: 'network-1',
    question: 'What does ping test?',
    options: ['Disk speed', 'Network connectivity', 'Memory usage', 'File permissions'],
    correctAnswer: 1,
    explanation: 'ping tests network connectivity by sending ICMP echo requests to a host.',
    commandId: 'ping',
    category: 'network'
  },
  {
    id: 'network-2',
    question: 'What does ping -c 4 do?',
    options: ['Continuously ping', 'Send 4 packets only', 'Count to 4', 'Clear after 4'],
    correctAnswer: 1,
    explanation: 'The -c flag specifies the count of packets to send (4 in this case).',
    commandId: 'ping',
    category: 'network'
  },
  {
    id: 'network-3',
    question: 'What is curl primarily used for?',
    options: ['File compression', 'Data transfer via URLs', 'Network scanning', 'Packet capture'],
    correctAnswer: 1,
    explanation: 'curl is a tool for transferring data from or to a server using various protocols.',
    commandId: 'curl',
    category: 'network'
  },
  {
    id: 'network-4',
    question: 'What does curl -I fetch?',
    options: ['Full content', 'Headers only', 'Images only', 'Insecure'],
    correctAnswer: 1,
    explanation: 'The -I flag fetches only HTTP headers, not the body content.',
    commandId: 'curl',
    category: 'network'
  },
  {
    id: 'network-5',
    question: 'What does wget -c do?',
    options: ['Create directory', 'Resume interrupted downloads', 'Compress download', 'Check file'],
    correctAnswer: 1,
    explanation: 'The -c flag continues/resumes interrupted downloads.',
    commandId: 'wget',
    category: 'network'
  },
  {
    id: 'network-6',
    question: 'What protocol does SSH stand for?',
    options: ['Simple Shell Host', 'Secure Shell', 'System Shell Handler', 'Standard Shell Helper'],
    correctAnswer: 1,
    explanation: 'SSH stands for Secure Shell, providing encrypted remote login.',
    commandId: 'ssh',
    category: 'network'
  },
  {
    id: 'network-7',
    question: 'What does scp -p preserve?',
    options: ['Port number', 'Permissions and timestamps', 'Password', 'Path'],
    correctAnswer: 1,
    explanation: 'The -p flag preserves file permissions and modification times.',
    commandId: 'scp',
    category: 'network'
  },
  {
    id: 'network-8',
    question: 'What is the modern replacement for ifconfig?',
    options: ['ipconfig', 'netsetup', 'ip', 'ifup'],
    correctAnswer: 2,
    explanation: 'The ip command is the modern replacement for ifconfig.',
    commandId: 'ip',
    category: 'network'
  },
  {
    id: 'network-9',
    question: 'What does netstat -tuln show?',
    options: ['All connections', 'TCP and UDP listening ports', 'UNIX sockets', 'Network interfaces'],
    correctAnswer: 1,
    explanation: '-t shows TCP, -u shows UDP, -l shows listening, -n shows numeric addresses.',
    commandId: 'netstat',
    category: 'network'
  },
  {
    id: 'network-10',
    question: 'What does traceroute show?',
    options: ['Download speed', 'Network hops to destination', 'DNS records', 'Packet loss only'],
    correctAnswer: 1,
    explanation: 'traceroute shows the network path (hops) packets take to reach a destination.',
    commandId: 'traceroute',
    category: 'network'
  },
  {
    id: 'network-11',
    question: 'What does dig +short do?',
    options: ['Short timeout', 'Concise output', 'Short domain only', 'Show errors only'],
    correctAnswer: 1,
    explanation: '+short displays only the IP address without extra information.',
    commandId: 'dig',
    category: 'network'
  },
  {
    id: 'network-12',
    question: 'What record type does DNS MX represent?',
    options: ['Mail Exchange', 'Main X', 'Multi X', 'Media Exchange'],
    correctAnswer: 0,
    explanation: 'MX records specify mail exchange servers for email delivery.',
    commandId: 'nslookup',
    category: 'network'
  },

  // SYSTEM Category - 12 questions
  {
    id: 'system-1',
    question: 'What does df command display?',
    options: ['Disk space usage', 'File details', 'Directory tree', 'Free memory'],
    correctAnswer: 0,
    explanation: 'df (Disk Free) displays available and used disk space on file systems.',
    commandId: 'df',
    category: 'system'
  },
  {
    id: 'system-2',
    question: 'What does df -h do?',
    options: ['Shows hidden files', 'Human-readable sizes', 'Shows hard links', 'Shows inodes'],
    correctAnswer: 1,
    explanation: 'The -h flag displays sizes in human-readable format (KB, MB, GB).',
    commandId: 'df',
    category: 'system'
  },
  {
    id: 'system-3',
    question: 'What does du command show?',
    options: ['Disk usage per file/directory', 'Free memory', 'Uptime', 'User list'],
    correctAnswer: 0,
    explanation: 'du (Disk Usage) estimates file and directory space usage.',
    commandId: 'du',
    category: 'system'
  },
  {
    id: 'system-4',
    question: 'What does du -sh * show?',
    options: ['All files sorted', 'Summary of each item in human format', 'Hidden files only', 'System files'],
    correctAnswer: 1,
    explanation: '-s shows summary total, -h shows human-readable sizes, * matches all items.',
    commandId: 'du',
    category: 'system'
  },
  {
    id: 'system-5',
    question: 'What does free command display?',
    options: ['Free disk space', 'Free and used memory', 'Free CPU cores', 'Free network ports'],
    correctAnswer: 1,
    explanation: 'free displays the amount of free and used memory in the system.',
    commandId: 'free',
    category: 'system'
  },
  {
    id: 'system-6',
    question: 'What does free -h display?',
    options: ['Help info', 'Human-readable format', 'Hidden memory', 'High memory only'],
    correctAnswer: 1,
    explanation: 'The -h flag shows memory values in human-readable units (MB, GB).',
    commandId: 'free',
    category: 'system'
  },
  {
    id: 'system-7',
    question: 'What does uname -r show?',
    options: ['All system info', 'Kernel release', 'Machine hardware', 'Hostname'],
    correctAnswer: 1,
    explanation: 'The -r flag shows the kernel release version.',
    commandId: 'uname',
    category: 'system'
  },
  {
    id: 'system-8',
    question: 'What does w command display?',
    options: ['Who is logged in and what they do', 'Weather information', 'Window list', 'Web processes'],
    correctAnswer: 0,
    explanation: 'w shows who is logged in and what commands they are running.',
    commandId: 'w',
    category: 'system'
  },
  {
    id: 'system-9',
    question: 'What does lsof -i :8080 show?',
    options: ['Files in directory 8080', 'Processes using port 8080', 'Files named 8080', 'Inode 8080'],
    correctAnswer: 1,
    explanation: '-i shows network connections, :8080 filters by port number.',
    commandId: 'lsof',
    category: 'system'
  },
  {
    id: 'system-10',
    question: 'What does systemctl status nginx do?',
    options: ['Start nginx', 'Stop nginx', 'Check nginx service status', 'Restart nginx'],
    correctAnswer: 2,
    explanation: 'systemctl status checks whether the nginx service is running.',
    commandId: 'systemctl',
    category: 'system'
  },
  {
    id: 'system-11',
    question: 'What does systemctl enable do?',
    options: ['Start a service', 'Enable auto-start on boot', 'Enable debugging', 'Enable networking'],
    correctAnswer: 1,
    explanation: 'enable makes a service start automatically when the system boots.',
    commandId: 'systemctl',
    category: 'system'
  },
  {
    id: 'system-12',
    question: 'What does journalctl -f do?',
    options: ['Filter by file', 'Follow logs in real-time', 'Show first log', 'Format logs'],
    correctAnswer: 1,
    explanation: 'The -f flag follows journal logs like tail -f, showing new entries as they arrive.',
    commandId: 'journalctl',
    category: 'system'
  },

  // SHELL SCRIPTING Category - 12 questions
  {
    id: 'scripting-1',
    question: 'What does echo -n do?',
    options: ['Show numbers', 'No newline at end', 'Negate output', 'New line only'],
    correctAnswer: 1,
    explanation: 'The -n flag suppresses the trailing newline normally added by echo.',
    commandId: 'echo',
    category: 'scripting'
  },
  {
    id: 'scripting-2',
    question: 'What does read -p do?',
    options: ['Password input', 'Prompt before input', 'Parse input', 'Previous read'],
    correctAnswer: 1,
    explanation: 'The -p flag displays a prompt before reading input.',
    commandId: 'read',
    category: 'scripting'
  },
  {
    id: 'scripting-3',
    question: 'What does read -s do?',
    options: ['Silent input (no echo)', 'Stop on space', 'Short input', 'String input'],
    correctAnswer: 0,
    explanation: 'The -s flag does not echo input characters (useful for passwords).',
    commandId: 'read',
    category: 'scripting'
  },
  {
    id: 'scripting-4',
    question: 'What does export do?',
    options: ['Print output', 'Set environment variable', 'Execute file', 'Exclude variable'],
    correctAnswer: 1,
    explanation: 'export sets environment variables that will be available to child processes.',
    commandId: 'export',
    category: 'scripting'
  },
  {
    id: 'scripting-5',
    question: 'What does alias create?',
    options: ['Hard link', 'Command shortcut', 'Environment variable', 'Function'],
    correctAnswer: 1,
    explanation: 'alias creates command shortcuts for longer or complex commands.',
    commandId: 'alias',
    category: 'scripting'
  },
  {
    id: 'scripting-6',
    question: 'What does source do?',
    options: ['Copy file', 'Execute in current shell', 'Show file source', 'Search source'],
    correctAnswer: 1,
    explanation: 'source executes commands from a file in the current shell (affects current environment).',
    commandId: 'source',
    category: 'scripting'
  },
  {
    id: 'scripting-7',
    question: 'What does chmod +x do?',
    options: ['Make file readable', 'Make file writable', 'Make file executable', 'Exclude file'],
    correctAnswer: 2,
    explanation: '+x adds execute permission, allowing the file to be run as a program.',
    commandId: 'chmod',
    category: 'scripting'
  },
  {
    id: 'scripting-8',
    question: 'What permission does 644 represent?',
    options: ['rwxr-xr-x', 'rw-r--r--', 'r--r--r--', 'rwx------'],
    correctAnswer: 1,
    explanation: '644 means: owner (rw=6), group (r=4), others (r=4).',
    commandId: 'chmod',
    category: 'scripting'
  },
  {
    id: 'scripting-9',
    question: 'What does test -f check?',
    options: ['File is readable', 'File exists and is regular file', 'File is writable', 'File is executable'],
    correctAnswer: 1,
    explanation: '-f returns true if the file exists and is a regular file.',
    commandId: 'test',
    category: 'scripting'
  },
  {
    id: 'scripting-10',
    question: 'What does test -d check?',
    options: ['Data file', 'Directory exists', 'Disk free', 'Date file'],
    correctAnswer: 1,
    explanation: '-d returns true if the path exists and is a directory.',
    commandId: 'test',
    category: 'scripting'
  },
  {
    id: 'scripting-11',
    question: 'What does crontab -e do?',
    options: ['Execute crontab', 'List crontab', 'Edit crontab', 'Delete crontab'],
    correctAnswer: 2,
    explanation: 'The -e flag opens the crontab file in your editor for editing.',
    commandId: 'crontab',
    category: 'scripting'
  },
  {
    id: 'scripting-12',
    question: 'What is the format of crontab time specification?',
    options: ['day hour month weekday minute', 'minute hour day month weekday', 'hour minute day month weekday', 'weekday hour minute day month'],
    correctAnswer: 1,
    explanation: 'Crontab format: minute hour day month weekday (5 fields space-separated).',
    commandId: 'crontab',
    category: 'scripting'
  }
]

const resources: Resource[] = [
  {
    id: 'r1',
    title: 'GNU Coreutils Documentation',
    description: 'Official documentation for core Linux commands including ls, cp, mv, and more.',
    url: 'https://www.gnu.org/software/coreutils/manual/',
    category: 'Official Docs'
  },
  {
    id: 'r2',
    title: 'Linux Command Library',
    description: 'Comprehensive command reference with examples for all major Linux distributions.',
    url: 'https://linux.die.net/',
    category: 'Reference'
  },
  {
    id: 'r3',
    title: 'Bash Guide for Beginners',
    description: 'Learn bash scripting from scratch with this comprehensive guide.',
    url: 'https://tldp.org/LDP/Bash-Beginners-Guide/html/',
    category: 'Learning'
  },
  {
    id: 'r4',
    title: 'ExplainShell.com',
    description: 'Break down and explain complex shell commands line by line.',
    url: 'https://explainshell.com',
    category: 'Tools'
  },
  {
    id: 'r5',
    title: 'Arch Linux Wiki',
    description: 'Excellent resource for detailed command explanations and best practices.',
    url: 'https://wiki.archlinux.org/',
    category: 'Reference'
  },
  {
    id: 'r6',
    title: 'Devhints.io Bash Cheatsheet',
    description: 'Quick reference guide for common bash commands and scripting.',
    url: 'https://devhints.io/bash',
    category: 'Cheatsheet'
  },
  {
    id: 'r7',
    title: 'ShellCheck',
    description: 'Static analysis tool for shell scripts that finds bugs and suggests improvements.',
    url: 'https://www.shellcheck.net/',
    category: 'Tools'
  },
  {
    id: 'r8',
    title: 'The Linux Documentation Project',
    description: 'Comprehensive guides and how-tos for all things Linux.',
    url: 'https://tldp.org/',
    category: 'Learning'
  }
]

const commands: Command[] = [
  // Basics
  {
    id: 'pwd',
    name: 'pwd',
    description: 'Print Working Directory - Shows your current location in the filesystem',
    syntax: 'pwd [options]',
    examples: ['pwd', 'pwd -P (print physical path)'],
    category: 'basics',
    difficulty: 'beginner',
    tips: ['Use -P to resolve symbolic links', 'Essential for scripting when you need absolute paths']
  },
  {
    id: 'ls',
    name: 'ls',
    description: 'List directory contents - Shows files and directories',
    syntax: 'ls [options] [directory]',
    examples: ['ls', 'ls -la (detailed list with hidden files)', 'ls -lh (human-readable sizes)', 'ls -lt (sorted by time)'],
    category: 'basics',
    difficulty: 'beginner',
    tips: ['-a shows hidden files (starting with .)', '-l shows detailed information', '-h gives human-readable file sizes', '-t sorts by modification time']
  },
  {
    id: 'cd',
    name: 'cd',
    description: 'Change Directory - Navigate to another directory',
    syntax: 'cd [directory]',
    examples: ['cd /home/user', 'cd ~ (go to home directory)', 'cd .. (go up one level)', 'cd - (go to previous directory)'],
    category: 'basics',
    difficulty: 'beginner',
    tips: ['~ represents your home directory', '.. represents parent directory', '- returns to previous directory', 'Use tab completion for faster navigation']
  },
  {
    id: 'clear',
    name: 'clear',
    description: 'Clear the terminal screen',
    syntax: 'clear',
    examples: ['clear', 'Ctrl+L (keyboard shortcut)'],
    category: 'basics',
    difficulty: 'beginner',
    tips: ['Use Ctrl+L for faster clearing', 'Does not affect command history']
  },
  {
    id: 'history',
    name: 'history',
    description: 'View command history - Shows previously executed commands',
    syntax: 'history [options]',
    examples: ['history', 'history 10 (last 10 commands)', '!100 (rerun command #100)', '!! (rerun last command)'],
    category: 'basics',
    difficulty: 'beginner',
    tips: ['Use !n to rerun command number n', 'Ctrl+R searches history', 'Use !! to repeat last command', '!$ repeats last argument']
  },
  // File Operations
  {
    id: 'mkdir',
    name: 'mkdir',
    description: 'Make Directory - Create new directories',
    syntax: 'mkdir [options] directory_name',
    examples: ['mkdir myfolder', 'mkdir -p parent/child/grandchild (create nested dirs)', 'mkdir -m 755 myfolder (set permissions)'],
    category: 'files',
    difficulty: 'beginner',
    tips: ['-p creates parent directories if needed', '-v shows created directories', '-m sets permissions immediately']
  },
  {
    id: 'rmdir',
    name: 'rmdir',
    description: 'Remove Directory - Delete empty directories',
    syntax: 'rmdir [options] directory_name',
    examples: ['rmdir empty_folder', 'rmdir -p parent/child (remove parents too)'],
    category: 'files',
    difficulty: 'beginner',
    tips: ['Only works on empty directories', 'Use rm -r for directories with content', '-p removes parent directories if empty']
  },
  {
    id: 'touch',
    name: 'touch',
    description: 'Create empty files or update timestamps',
    syntax: 'touch [options] filename',
    examples: ['touch newfile.txt', 'touch -t 202401011200 file.txt (set timestamp)'],
    category: 'files',
    difficulty: 'beginner',
    tips: ['Creates file if it does not exist', 'Updates timestamp if file exists', 'Useful for creating files quickly']
  },
  {
    id: 'cp',
    name: 'cp',
    description: 'Copy files and directories',
    syntax: 'cp [options] source destination',
    examples: ['cp file1.txt file2.txt', 'cp -r folder1 folder2 (copy directory)', 'cp -p file1.txt file2.txt (preserve attributes)'],
    category: 'files',
    difficulty: 'beginner',
    tips: ['-r copies directories recursively', '-p preserves permissions and timestamps', '-i prompts before overwriting', '-v shows files being copied']
  },
  {
    id: 'mv',
    name: 'mv',
    description: 'Move or rename files and directories',
    syntax: 'mv [options] source destination',
    examples: ['mv oldname.txt newname.txt (rename)', 'mv file.txt /path/to/folder/ (move)', 'mv -i file.txt folder/ (prompt before overwrite)'],
    category: 'files',
    difficulty: 'beginner',
    tips: ['Used for both moving and renaming', '-i prompts before overwriting', '-v shows files being moved', '-n prevents overwriting']
  },
  {
    id: 'rm',
    name: 'rm',
    description: 'Remove files and directories',
    syntax: 'rm [options] file...',
    examples: ['rm file.txt', 'rm -r folder/ (remove directory)', 'rm -rf folder/ (force remove without prompts)'],
    category: 'files',
    difficulty: 'intermediate',
    tips: ['-r removes directories recursively', '-f forces removal without prompts', '-i prompts before each removal', 'Use with extreme caution - files cannot be easily recovered']
  },
  {
    id: 'find',
    name: 'find',
    description: 'Search for files in a directory hierarchy',
    syntax: 'find [path] [options] [expression]',
    examples: ['find . -name "*.txt"', 'find /home -type d (find directories)', 'find . -size +10M (files larger than 10MB)', 'find . -mtime -7 (modified in last 7 days)'],
    category: 'files',
    difficulty: 'intermediate',
    tips: ['Use -name for filename patterns', '-type filters by file type', '-size filters by size', '-mtime filters by modification time']
  },
  {
    id: 'ln',
    name: 'ln',
    description: 'Create links between files',
    syntax: 'ln [options] target link_name',
    examples: ['ln file.txt link.txt (hard link)', 'ln -s /path/to/file symlink.txt (symbolic link)'],
    category: 'files',
    difficulty: 'intermediate',
    tips: ['-s creates symbolic (soft) links', 'Hard links share the same inode', 'Symbolic links can cross filesystems', 'Use -sf to force overwrite existing link']
  },
  // Text Processing
  {
    id: 'cat',
    name: 'cat',
    description: 'Concatenate and display file contents',
    syntax: 'cat [options] file...',
    examples: ['cat file.txt', 'cat -n file.txt (show line numbers)', 'cat file1.txt file2.txt > combined.txt', 'cat -A file.txt (show special characters)'],
    category: 'text',
    difficulty: 'beginner',
    tips: ['-n shows line numbers', '-b numbers non-empty lines only', '-A shows all special characters', 'Use less for large files']
  },
  {
    id: 'less',
    name: 'less',
    description: 'View file contents with pagination',
    syntax: 'less [options] file',
    examples: ['less file.txt', 'less +F file.txt (follow mode like tail -f)', 'less -N file.txt (show line numbers)'],
    category: 'text',
    difficulty: 'beginner',
    tips: ['Use /pattern to search forward', 'Use ?pattern to search backward', 'Press q to quit', 'Use arrow keys to navigate']
  },
  {
    id: 'head',
    name: 'head',
    description: 'Output the first part of files',
    syntax: 'head [options] file',
    examples: ['head file.txt', 'head -n 20 file.txt (first 20 lines)', 'head -c 100 file.txt (first 100 bytes)'],
    category: 'text',
    difficulty: 'beginner',
    tips: ['-n specifies number of lines', '-c specifies number of bytes', 'Default shows first 10 lines', 'Useful for previewing large files']
  },
  {
    id: 'tail',
    name: 'tail',
    description: 'Output the last part of files',
    syntax: 'tail [options] file',
    examples: ['tail file.txt', 'tail -n 20 file.txt (last 20 lines)', 'tail -f logfile.txt (follow as file grows)'],
    category: 'text',
    difficulty: 'beginner',
    tips: ['-f follows file in real-time', '-n specifies number of lines', '-F follows even if file is rotated', 'Essential for monitoring logs']
  },
  {
    id: 'grep',
    name: 'grep',
    description: 'Search text patterns in files',
    syntax: 'grep [options] pattern file...',
    examples: ['grep "error" logfile.txt', 'grep -r "TODO" ./ (recursive search)', 'grep -i "hello" file.txt (case insensitive)', 'grep -n "pattern" file.txt (show line numbers)'],
    category: 'text',
    difficulty: 'intermediate',
    tips: ['-i for case insensitive search', '-r for recursive directory search', '-n shows line numbers', '-v inverts match (shows non-matching lines)', '-c counts matching lines']
  },
  {
    id: 'sed',
    name: 'sed',
    description: 'Stream editor for filtering and transforming text',
    syntax: 'sed [options] \'command\' file',
    examples: ['sed \'s/old/new/g\' file.txt (replace all occurrences)', 'sed -i \'s/old/new/g\' file.txt (edit in place)', 'sed \'/pattern/d\' file.txt (delete matching lines)'],
    category: 'text',
    difficulty: 'advanced',
    tips: ['s/old/new/g substitutes text globally', '-i edits files in place (use with caution)', '/pattern/d deletes matching lines', '-n suppresses automatic printing', 'Useful for batch text processing']
  },
  {
    id: 'awk',
    name: 'awk',
    description: 'Pattern scanning and text processing language',
    syntax: 'awk \'pattern { action }\' file',
    examples: ['awk \'{print $1}\' file.txt (print first column)', 'awk -F: \'{print $1}\' /etc/passwd (colon as separator)', 'awk \'/error/ {count++} END {print count}\' logfile.txt'],
    category: 'text',
    difficulty: 'advanced',
    tips: ['$1, $2... represent columns', '-F sets field separator', 'NR is the current line number', 'Excellent for columnar data', 'Supports variables, loops, and conditions']
  },
  {
    id: 'sort',
    name: 'sort',
    description: 'Sort lines of text files',
    syntax: 'sort [options] file',
    examples: ['sort file.txt', 'sort -r file.txt (reverse order)', 'sort -n numbers.txt (numeric sort)', 'sort -u file.txt (unique lines only)'],
    category: 'text',
    difficulty: 'intermediate',
    tips: ['-n for numeric sorting', '-r for reverse order', '-u for unique lines', '-k to sort by specific column', '-t to set field separator']
  },
  {
    id: 'uniq',
    name: 'uniq',
    description: 'Report or omit repeated lines',
    syntax: 'uniq [options] file',
    examples: ['uniq file.txt', 'sort file.txt | uniq (remove duplicates)', 'uniq -c file.txt (count occurrences)'],
    category: 'text',
    difficulty: 'intermediate',
    tips: ['Requires sorted input', '-c shows count of duplicates', '-d shows only duplicate lines', '-u shows only unique lines']
  },
  {
    id: 'wc',
    name: 'wc',
    description: 'Count lines, words, and bytes',
    syntax: 'wc [options] file',
    examples: ['wc file.txt', 'wc -l file.txt (count lines)', 'wc -w file.txt (count words)', 'wc -c file.txt (count bytes)'],
    category: 'text',
    difficulty: 'beginner',
    tips: ['-l counts lines', '-w counts words', '-c counts bytes', '-m counts characters', 'Useful for quick file analysis']
  },
  {
    id: 'diff',
    name: 'diff',
    description: 'Compare files line by line',
    syntax: 'diff [options] file1 file2',
    examples: ['diff file1.txt file2.txt', 'diff -u file1.txt file2.txt (unified format)', 'diff -r dir1/ dir2/ (compare directories)'],
    category: 'text',
    difficulty: 'intermediate',
    tips: ['-u unified output format', '-r recursive directory comparison', '-q report only if different', '-y side-by-side comparison', 'Essential for code reviews']
  },
  // Process Management
  {
    id: 'ps',
    name: 'ps',
    description: 'Report current processes',
    syntax: 'ps [options]',
    examples: ['ps', 'ps aux (all processes)', 'ps -ef (full format)', 'ps -u username (user processes)'],
    category: 'process',
    difficulty: 'beginner',
    tips: ['aux shows all processes for all users', '-ef shows full process tree', '-u filters by user', 'PID is needed for kill command']
  },
  {
    id: 'top',
    name: 'top',
    description: 'Display real-time system processes',
    syntax: 'top [options]',
    examples: ['top', 'top -u username (filter by user)', 'top -p 1234 (monitor specific PID)'],
    category: 'process',
    difficulty: 'beginner',
    tips: ['Press q to quit', 'Press k to kill a process', 'Press P to sort by CPU', 'Press M to sort by memory', 'Real-time monitoring']
  },
  {
    id: 'htop',
    name: 'htop',
    description: 'Interactive process viewer (enhanced top)',
    syntax: 'htop [options]',
    examples: ['htop', 'htop -u username', 'htop -p 1234,5678'],
    category: 'process',
    difficulty: 'beginner',
    tips: ['Mouse-enabled interface', 'Press F9 to kill processes', 'F6 for sorting options', 'Colors for easy reading', 'Better than top for interactive use']
  },
  {
    id: 'kill',
    name: 'kill',
    description: 'Send signals to processes',
    syntax: 'kill [options] PID',
    examples: ['kill 1234 (SIGTERM)', 'kill -9 1234 (SIGKILL - force kill)', 'kill -l (list all signals)'],
    category: 'process',
    difficulty: 'intermediate',
    tips: ['-9 (SIGKILL) forces termination', '-15 (SIGTERM) is default and graceful', '-l lists available signals', 'Find PID with ps first']
  },
  {
    id: 'killall',
    name: 'killall',
    description: 'Kill processes by name',
    syntax: 'killall [options] process_name',
    examples: ['killall firefox', 'killall -9 chrome', 'killall -u username'],
    category: 'process',
    difficulty: 'intermediate',
    tips: ['Kills all processes with given name', '-9 forces termination', '-i prompts before killing', '-u kills processes for specific user', 'Be careful with common names']
  },
  {
    id: 'pkill',
    name: 'pkill',
    description: 'Kill processes based on name and other attributes',
    syntax: 'pkill [options] pattern',
    examples: ['pkill firefox', 'pkill -f "python script.py" (match full command)', 'pkill -u username'],
    category: 'process',
    difficulty: 'intermediate',
    tips: ['-f matches full command line', '-u filters by user', '-t filters by terminal', 'More flexible than killall']
  },
  {
    id: 'bg',
    name: 'bg',
    description: 'Resume suspended jobs in background',
    syntax: 'bg [job_id]',
    examples: ['bg', 'bg %1 (resume job 1)', 'Ctrl+Z to suspend, then bg to background'],
    category: 'process',
    difficulty: 'intermediate',
    tips: ['Use Ctrl+Z to suspend a process', 'bg resumes it in background', 'jobs shows background jobs', 'Use fg to bring back to foreground']
  },
  {
    id: 'fg',
    name: 'fg',
    description: 'Bring background job to foreground',
    syntax: 'fg [job_id]',
    examples: ['fg', 'fg %1', 'jobs (to see job numbers)'],
    category: 'process',
    difficulty: 'intermediate',
    tips: ['Brings background job to foreground', 'Use jobs to see background processes', 'Add & to command to start in background', 'Ctrl+Z to suspend again']
  },
  {
    id: 'jobs',
    name: 'jobs',
    description: 'Display status of jobs in current shell',
    syntax: 'jobs [options]',
    examples: ['jobs', 'jobs -l (show PIDs)', 'jobs -r (running jobs only)', 'jobs -s (stopped jobs only)'],
    category: 'process',
    difficulty: 'intermediate',
    tips: ['-l shows process IDs', '-r shows only running jobs', '-s shows only stopped jobs', 'Job numbers used with fg, bg, kill']
  },
  {
    id: 'nohup',
    name: 'nohup',
    description: 'Run command immune to hangups',
    syntax: 'nohup command &',
    examples: ['nohup ./long_script.sh &', 'nohup python script.py > output.log 2>&1 &'],
    category: 'process',
    difficulty: 'intermediate',
    tips: ['Use with & for background execution', 'Output goes to nohup.out by default', 'Process continues after logout', 'Essential for long-running tasks']
  },
  {
    id: 'screen',
    name: 'screen',
    description: 'Terminal multiplexer for persistent sessions',
    syntax: 'screen [options]',
    examples: ['screen', 'screen -S sessionname', 'screen -r (resume)', 'Ctrl+A then D (detach)'],
    category: 'process',
    difficulty: 'advanced',
    tips: ['Ctrl+A D to detach session', 'screen -r to resume', 'screen -ls to list sessions', 'Persists after logout', 'Great for remote work']
  },
  {
    id: 'tmux',
    name: 'tmux',
    description: 'Terminal multiplexer (modern alternative to screen)',
    syntax: 'tmux [command]',
    examples: ['tmux', 'tmux new -s sessionname', 'tmux attach -t sessionname', 'tmux ls (list sessions)'],
    category: 'process',
    difficulty: 'advanced',
    tips: ['Ctrl+B is the prefix key', 'Ctrl+B D to detach', 'tmux attach to resume', 'Split panes with Ctrl+B %" or Ctrl+B $', 'More powerful than screen']
  },
  // Network Commands
  {
    id: 'ping',
    name: 'ping',
    description: 'Test network connectivity to a host',
    syntax: 'ping [options] host',
    examples: ['ping google.com', 'ping -c 4 google.com (4 packets)', 'ping -i 2 google.com (2 second interval)'],
    category: 'network',
    difficulty: 'beginner',
    tips: ['-c specifies number of packets', '-i changes packet interval', '-s sets packet size', 'Ctrl+C to stop']
  },
  {
    id: 'curl',
    name: 'curl',
    description: 'Transfer data from or to a server',
    syntax: 'curl [options] URL',
    examples: ['curl https://example.com', 'curl -I https://example.com (headers only)', 'curl -O https://example.com/file.txt (download)', 'curl -X POST -d data URL'],
    category: 'network',
    difficulty: 'intermediate',
    tips: ['-I fetch headers only', '-O saves with remote filename', '-o specifies output filename', '-X specifies HTTP method', '-d sends data in POST']
  },
  {
    id: 'wget',
    name: 'wget',
    description: 'Download files from the web',
    syntax: 'wget [options] URL',
    examples: ['wget https://example.com/file.zip', 'wget -c URL (resume interrupted)', 'wget -r URL (recursive download)'],
    category: 'network',
    difficulty: 'intermediate',
    tips: ['-c resumes interrupted downloads', '-r for recursive downloads', '-b downloads in background', '-O specifies output filename', 'Good for batch downloads']
  },
  {
    id: 'ssh',
    name: 'ssh',
    description: 'Secure Shell for remote login',
    syntax: 'ssh [options] user@host',
    examples: ['ssh user@192.168.1.1', 'ssh -p 2222 user@host (custom port)', 'ssh -i key.pem user@host (use key file)'],
    category: 'network',
    difficulty: 'intermediate',
    tips: ['-p specifies port', '-i uses identity file', '-L creates local tunnel', '-R creates remote tunnel', 'Copy public key with ssh-copy-id']
  },
  {
    id: 'scp',
    name: 'scp',
    description: 'Secure copy over SSH',
    syntax: 'scp [options] source destination',
    examples: ['scp file.txt user@host:/path/', 'scp user@host:/path/file.txt ./', 'scp -r folder/ user@host:/path/'],
    category: 'network',
    difficulty: 'intermediate',
    tips: ['-r for recursive directory copy', '-P specifies port', '-p preserves timestamps', '-C enables compression', 'Uses SSH for security']
  },
  {
    id: 'ifconfig',
    name: 'ifconfig',
    description: 'Configure network interfaces',
    syntax: 'ifconfig [interface] [options]',
    examples: ['ifconfig', 'ifconfig eth0', 'ifconfig eth0 up (bring up)', 'ifconfig eth0 down (bring down)'],
    category: 'network',
    difficulty: 'intermediate',
    tips: ['Shows IP addresses', 'up/down to control interface', 'Deprecated in favor of ip command', 'Needs sudo for changes']
  },
  {
    id: 'ip',
    name: 'ip',
    description: 'Modern network configuration tool',
    syntax: 'ip [options] object {command}',
    examples: ['ip addr show', 'ip link set eth0 up', 'ip route show', 'ip -br addr (brief output)'],
    category: 'network',
    difficulty: 'intermediate',
    tips: ['Replaces ifconfig and route', 'ip addr for addresses', 'ip route for routing', 'ip link for interfaces', 'More powerful than ifconfig']
  },
  {
    id: 'netstat',
    name: 'netstat',
    description: 'Network statistics and connections',
    syntax: 'netstat [options]',
    examples: ['netstat -tuln (listening ports)', 'netstat -an (all connections)', 'netstat -rn (routing table)'],
    category: 'network',
    difficulty: 'intermediate',
    tips: ['-t shows TCP connections', '-u shows UDP connections', '-l shows listening sockets', '-n shows numeric addresses', '-p shows process names (needs sudo)']
  },
  {
    id: 'ss',
    name: 'ss',
    description: 'Modern socket statistics (replacement for netstat)',
    syntax: 'ss [options]',
    examples: ['ss -tuln', 'ss -s (summary)', 'ss -p (show processes)', 'ss -t state established'],
    category: 'network',
    difficulty: 'advanced',
    tips: ['Faster than netstat', '-t for TCP, -u for UDP', '-l for listening', '-p shows process info', '-n for numeric addresses']
  },
  {
    id: 'traceroute',
    name: 'traceroute',
    description: 'Trace packet route to host',
    syntax: 'traceroute [options] host',
    examples: ['traceroute google.com', 'traceroute -n google.com (no DNS lookup)', 'traceroute -w 2 google.com (timeout 2s)'],
    category: 'network',
    difficulty: 'intermediate',
    tips: ['-n skips DNS lookups (faster)', '-w sets timeout', '-m sets max hops', 'Shows each hop to destination', 'Useful for debugging network issues']
  },
  {
    id: 'nslookup',
    name: 'nslookup',
    description: 'Query DNS for domain information',
    syntax: 'nslookup [options] domain',
    examples: ['nslookup google.com', 'nslookup -type=MX google.com (mail records)', 'nslookup -type=NS google.com (name servers)'],
    category: 'network',
    difficulty: 'intermediate',
    tips: ['Query different record types with -type', 'A records: IP addresses', 'MX records: mail servers', 'NS records: name servers', 'Being replaced by dig']
  },
  {
    id: 'dig',
    name: 'dig',
    description: 'DNS lookup utility (more powerful than nslookup)',
    syntax: 'dig [@server] domain [query-type]',
    examples: ['dig google.com', 'dig +short google.com', 'dig MX gmail.com', 'dig @8.8.8.8 google.com'],
    category: 'network',
    difficulty: 'advanced',
    tips: ['+short for concise output', 'Specify DNS server with @', 'Query any DNS record type', '+trace shows DNS resolution path', 'Better than nslookup']
  },
  // System Information
  {
    id: 'uname',
    name: 'uname',
    description: 'Print system information',
    syntax: 'uname [options]',
    examples: ['uname', 'uname -a (all information)', 'uname -r (kernel release)', 'uname -m (machine hardware)'],
    category: 'system',
    difficulty: 'beginner',
    tips: ['-a shows all information', '-r shows kernel version', '-m shows architecture', '-n shows hostname', '-o shows OS name']
  },
  {
    id: 'df',
    name: 'df',
    description: 'Report file system disk space usage',
    syntax: 'df [options]',
    examples: ['df', 'df -h (human-readable)', 'df -T (filesystem type)', 'df -i (inode usage)'],
    category: 'system',
    difficulty: 'beginner',
    tips: ['-h human-readable sizes', '-T shows filesystem type', '-i shows inode usage', '-x excludes filesystems', 'Essential for disk monitoring']
  },
  {
    id: 'du',
    name: 'du',
    description: 'Estimate file space usage',
    syntax: 'du [options] [file/directory]',
    examples: ['du -sh * (size of each item)', 'du -h folder/', 'du --max-depth=1 /home/', 'du -ah . (all files)'],
    category: 'system',
    difficulty: 'beginner',
    tips: ['-h human-readable sizes', '-s summary total', '--max-depth controls depth', '-a shows all files', 'Great for finding large files']
  },
  {
    id: 'free',
    name: 'free',
    description: 'Display amount of free and used memory',
    syntax: 'free [options]',
    examples: ['free', 'free -h (human-readable)', 'free -m (megabytes)', 'free -s 2 (update every 2 seconds)'],
    category: 'system',
    difficulty: 'beginner',
    tips: ['-h human-readable output', '-m shows in megabytes', '-g shows in gigabytes', '-s updates continuously', '-t shows total']
  },
  {
    id: 'uptime',
    name: 'uptime',
    description: 'Tell how long the system has been running',
    syntax: 'uptime [options]',
    examples: ['uptime', 'uptime -p (pretty format)', 'uptime -s (since)'],
    category: 'system',
    difficulty: 'beginner',
    tips: ['-p shows in pretty format', '-s shows system start time', 'Shows load averages', 'Useful for system monitoring']
  },
  {
    id: 'w',
    name: 'w',
    description: 'Show who is logged on and what they are doing',
    syntax: 'w [options] [user]',
    examples: ['w', 'w username', 'w -h (no header)'],
    category: 'system',
    difficulty: 'beginner',
    tips: ['Shows current users', 'Displays their activity', 'Shows system load', 'Monitor who is on your server']
  },
  {
    id: 'whoami',
    name: 'whoami',
    description: 'Print current user name',
    syntax: 'whoami',
    examples: ['whoami'],
    category: 'system',
    difficulty: 'beginner',
    tips: ['Simple command', 'Equivalent to id -un', 'Useful in scripts', 'Works in all shells']
  },
  {
    id: 'id',
    name: 'id',
    description: 'Print user and group IDs',
    syntax: 'id [options] [user]',
    examples: ['id', 'id username', 'id -u (user ID)', 'id -g (group ID)'],
    category: 'system',
    difficulty: 'beginner',
    tips: ['-u shows user ID', '-g shows group ID', '-G shows all groups', '-n shows names instead of numbers', 'Check permissions with this']
  },
  {
    id: 'lsof',
    name: 'lsof',
    description: 'List open files',
    syntax: 'lsof [options]',
    examples: ['lsof', 'lsof -i :8080 (port 8080)', 'lsof -u username', 'lsof /path/to/file'],
    category: 'system',
    difficulty: 'intermediate',
    tips: ['-i shows network connections', '-p shows specific PID', '-u shows files for user', '+f shows file locks', 'Essential for debugging "file in use" errors']
  },
  {
    id: 'systemctl',
    name: 'systemctl',
    description: 'Control the systemd system and service manager',
    syntax: 'systemctl [command] [service]',
    examples: ['systemctl status nginx', 'systemctl start nginx', 'systemctl stop nginx', 'systemctl restart nginx', 'systemctl enable nginx (auto-start)'],
    category: 'system',
    difficulty: 'intermediate',
    tips: ['status: check service status', 'start/stop: control services', 'restart/reload: restart with config', 'enable/disable: auto-start on boot', 'Essential for service management']
  },
  {
    id: 'journalctl',
    name: 'journalctl',
    description: 'Query the systemd journal',
    syntax: 'journalctl [options]',
    examples: ['journalctl -u nginx (nginx logs)', 'journalctl -f (follow logs)', 'journalctl --since today', 'journalctl -p err (errors only)'],
    category: 'system',
    difficulty: 'intermediate',
    tips: ['-u filter by unit/service', '-f follow logs (like tail -f)', '--since/--until time filters', '-p filter by priority', 'Modern replacement for syslog']
  },
  // Shell Scripting
  {
    id: 'echo',
    name: 'echo',
    description: 'Display a line of text',
    syntax: 'echo [options] string',
    examples: ['echo "Hello World"', 'echo -n "No newline"', 'echo -e "Line1\\nLine2" (interpret escape sequences)'],
    category: 'scripting',
    difficulty: 'beginner',
    tips: ['-n suppresses newline', '-e interprets escape sequences', 'Use variables: echo $VAR', 'Redirect to files: echo "text" > file']
  },
  {
    id: 'read',
    name: 'read',
    description: 'Read a line from standard input',
    syntax: 'read [options] variable',
    examples: ['read name', 'read -p "Enter: " var', 'read -s password (silent input)'],
    category: 'scripting',
    difficulty: 'beginner',
    tips: ['-p shows prompt', '-s for silent input (passwords)', '-t sets timeout', '-a reads into array', 'Essential for interactive scripts']
  },
  {
    id: 'export',
    name: 'export',
    description: 'Set environment variables',
    syntax: 'export VAR=value',
    examples: ['export PATH=$PATH:/new/path', 'export EDITOR=vim', 'export NODE_ENV=production'],
    category: 'scripting',
    difficulty: 'intermediate',
    tips: ['Sets variables for child processes', 'Use in .bashrc/.zshrc for persistence', 'View with: export', 'Unset with: unset VAR']
  },
  {
    id: 'alias',
    name: 'alias',
    description: 'Create command shortcuts',
    syntax: 'alias name="command"',
    examples: ['alias ll="ls -la"', 'alias gs="git status"', 'alias grep="grep --color=auto"'],
    category: 'scripting',
    difficulty: 'beginner',
    tips: ['Save aliases in .bashrc/.zshrc', 'Use quotes for complex commands', 'Show all aliases with: alias', 'Remove with: unalias name']
  },
  {
    id: 'source',
    name: 'source',
    description: 'Execute commands from a file in the current shell',
    syntax: 'source file',
    examples: ['source ~/.bashrc', 'source ./script.sh', '. ~/.bashrc (shorter form)'],
    category: 'scripting',
    difficulty: 'intermediate',
    tips: ['Changes affect current shell', 'Use to reload config files', '. (dot) is a synonym', 'Different from running script directly']
  },
  {
    id: 'chmod',
    name: 'chmod',
    description: 'Change file permissions',
    syntax: 'chmod [options] mode file',
    examples: ['chmod +x script.sh (executable)', 'chmod 644 file.txt', 'chmod -R 755 folder/ (recursive)'],
    category: 'scripting',
    difficulty: 'intermediate',
    tips: ['+x makes executable', '755: rwxr-xr-x', '644: rw-r--r--', '-R applies recursively', 'Learn octal permissions: 4=r, 2=w, 1=x']
  },
  {
    id: 'chown',
    name: 'chown',
    description: 'Change file owner and group',
    syntax: 'chown [options] owner[:group] file',
    examples: ['chown user file.txt', 'chown user:group file.txt', 'chown -R user:group folder/'],
    category: 'scripting',
    difficulty: 'intermediate',
    tips: ['Change owner only: chown user file', 'Change group: chown :group file', '-R applies recursively', 'Requires sudo']
  },
  {
    id: 'test',
    name: 'test',
    description: 'Check file types and compare values',
    syntax: 'test condition',
    examples: ['test -f file.txt', '[ -f file.txt ]', '[ $a -eq $b ]', '[ -d folder/ ]'],
    category: 'scripting',
    difficulty: 'intermediate',
    tips: ['-f: file exists', '-d: directory exists', '-eq, -ne, -gt, -lt: numeric compare', 'Use [ ] or [[ ] for conditions']
  },
  {
    id: 'crontab',
    name: 'crontab',
    description: 'Schedule periodic tasks',
    syntax: 'crontab [options]',
    examples: ['crontab -e (edit)', 'crontab -l (list)', '0 * * * * /path/to/script (hourly)'],
    category: 'scripting',
    difficulty: 'advanced',
    tips: ['-e edit crontab', '-l list crontab', '-r remove crontab', 'Format: min hour day month weekday', 'Use full paths in scripts']
  },
]

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CommandCategory | 'all'>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null)
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const [copiedExample, setCopiedExample] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [bookmarkedCommands, setBookmarkedCommands] = useState<Set<string>>(new Set())
  const [completedCommands, setCompletedCommands] = useState<Set<string>>(new Set())
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [practiceCategory, setPracticeCategory] = useState<CommandCategory | 'all'>('all')
  const [showTopicSelection, setShowTopicSelection] = useState(true)
  const [quizProgress, setQuizProgress] = useState<Record<string, { score: number; total: number; attempts: number }>>({})
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState<QuizQuestion[]>([])

  const filteredCommands = commands.filter(cmd => {
    const matchesSearch = cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cmd.examples.some(ex => ex.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || cmd.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const bookmarkedCommandsList = commands.filter(cmd => bookmarkedCommands.has(cmd.id))

  const copyToClipboard = (text: string, type: 'command' | 'example') => {
    navigator.clipboard.writeText(text)
    if (type === 'command') {
      setCopiedCommand(text)
      setTimeout(() => setCopiedCommand(null), 2000)
    } else {
      setCopiedExample(text)
      setTimeout(() => setCopiedExample(null), 2000)
    }
  }

  const toggleBookmark = (commandId: string) => {
    const newBookmarks = new Set(bookmarkedCommands)
    if (newBookmarks.has(commandId)) {
      newBookmarks.delete(commandId)
    } else {
      newBookmarks.add(commandId)
    }
    setBookmarkedCommands(newBookmarks)
  }

  const toggleComplete = (commandId: string) => {
    const newCompleted = new Set(completedCommands)
    if (newCompleted.has(commandId)) {
      newCompleted.delete(commandId)
    } else {
      newCompleted.add(commandId)
    }
    setCompletedCommands(newCompleted)
  }

  const scrollToCommands = () => {
    setCurrentView('home')
    setTimeout(() => {
      document.getElementById('commands-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
    if (answerIndex === quizQuestions[currentQuizIndex].correctAnswer) {
      setQuizScore(quizScore + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuizIndex < currentQuizQuestions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      handleQuizCompletion()
    }
  }

  const startPracticeQuiz = (category: CommandCategory | 'all') => {
    const filteredQuestions = category === 'all' 
      ? quizQuestions 
      : quizQuestions.filter(q => q.category === category)
    
    setCurrentQuizQuestions(filteredQuestions)
    setPracticeCategory(category)
    setCurrentQuizIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setQuizScore(0)
    setQuizCompleted(false)
    setShowTopicSelection(false)
  }

  const selectRandomCategory = () => {
    const categories: CommandCategory[] = ['basics', 'files', 'text', 'process', 'network', 'system', 'scripting']
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    startPracticeQuiz(randomCategory)
  }

  const getTopicProgress = (category: CommandCategory | 'all') => {
    const progress = quizProgress[category]
    if (!progress) return { score: 0, total: 0, attempts: 0 }
    return progress
  }

  const handleQuizCompletion = () => {
    const categoryKey = practiceCategory === 'all' ? 'mixed' : practiceCategory
    const currentProgress = quizProgress[categoryKey] || { score: 0, total: 0, attempts: 0 }
    
    setQuizProgress({
      ...quizProgress,
      [categoryKey]: {
        score: currentProgress.score + quizScore,
        total: currentQuizQuestions.length,
        attempts: currentProgress.attempts + 1
      }
    })
    setQuizCompleted(true)
  }

  const resetQuiz = () => {
    setCurrentQuizIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setQuizScore(0)
    setQuizCompleted(false)
  }

  const getLearningPathProgress = (pathId: string) => {
    const path = learningPaths.find(p => p.id === pathId)
    if (!path) return 0
    const completed = path.commands.filter(cmdId => completedCommands.has(cmdId)).length
    return Math.round((completed / path.commands.length) * 100)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setCurrentView('home')}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">aimtutor.ai</h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">Master Shell Commands</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => setCurrentView('home')}
                className={`text-sm font-medium transition-colors ${currentView === 'home' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400'}`}
              >
                Commands
              </button>
              <button 
                onClick={() => setCurrentView('curriculum')}
                className={`text-sm font-medium transition-colors ${currentView === 'curriculum' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400'}`}
              >
                Curriculum
              </button>
              <button 
                onClick={() => setCurrentView('practice')}
                className={`text-sm font-medium transition-colors ${currentView === 'practice' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400'}`}
              >
                Practice
              </button>
              <button 
                onClick={() => setCurrentView('resources')}
                className={`text-sm font-medium transition-colors ${currentView === 'resources' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400'}`}
              >
                Resources
              </button>
            </nav>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col gap-4">
                <button onClick={() => { setCurrentView('home'); setMobileMenuOpen(false) }} className="text-sm font-medium text-slate-700 dark:text-slate-300 text-left">Commands</button>
                <button onClick={() => { setCurrentView('curriculum'); setMobileMenuOpen(false) }} className="text-sm font-medium text-slate-700 dark:text-slate-300 text-left">Curriculum</button>
                <button onClick={() => { setCurrentView('practice'); setMobileMenuOpen(false) }} className="text-sm font-medium text-slate-700 dark:text-slate-300 text-left">Practice</button>
                <button onClick={() => { setCurrentView('resources'); setMobileMenuOpen(false) }} className="text-sm font-medium text-slate-700 dark:text-slate-300 text-left">Resources</button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <section className="py-12 md:py-16 px-4">
              <div className="container mx-auto text-center max-w-4xl">
                <Badge className="mb-4 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800">
                  <Zap className="w-3 h-3 mr-1" />
                  Interactive Learning Platform
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                  Master Shell Commands
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                  Learn essential Linux/Unix shell commands with practical examples, real-world use cases, and interactive practice. From basics to advanced scripting.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button size="lg" className="bg-violet-600 hover:bg-violet-700" onClick={scrollToCommands}>
                    <Terminal className="w-4 h-4 mr-2" />
                    Start Learning
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setCurrentView('curriculum')}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Curriculum
                  </Button>
                </div>
              </div>
            </section>

            {/* Search and Filters */}
            <section id="commands-section" className="px-4 pb-8 scroll-mt-20">
              <div className="container mx-auto max-w-7xl">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search commands, examples, or descriptions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Tabs defaultValue="all" className="w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <TabsList className="bg-slate-100 dark:bg-slate-800 overflow-x-auto">
                        <TabsTrigger 
                          value="all"
                          onClick={() => setSelectedCategory('all')}
                          className={selectedCategory === 'all' ? 'data-[state=active]:bg-white data-[state=active]:text-violet-600' : ''}
                        >
                          All ({commands.length})
                        </TabsTrigger>
                        {categories.map(cat => (
                          <TabsTrigger
                            key={cat.id}
                            value={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={selectedCategory === cat.id ? 'data-[state=active]:bg-white data-[state=active]:text-violet-600' : ''}
                          >
                            {cat.name}
                          </TabsTrigger>
                        ))}
                        {bookmarkedCommandsList.length > 0 && (
                          <TabsTrigger
                            value="bookmarks"
                            onClick={() => setSelectedCategory('bookmarks' as any)}
                            className={selectedCategory === 'bookmarks' ? 'data-[state=active]:bg-white data-[state=active]:text-violet-600' : ''}
                          >
                            <Star className="w-3 h-3 mr-1" />
                            Bookmarks ({bookmarkedCommandsList.length})
                          </TabsTrigger>
                        )}
                      </TabsList>

                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <select
                          value={selectedDifficulty}
                          onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                          className="px-3 py-1.5 rounded-md border bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300"
                        >
                          <option value="all">All Levels</option>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <TabsContent value={selectedCategory} className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedCategory === 'bookmarks' ? (
                          bookmarkedCommandsList.map(cmd => (
                            <CommandCard
                              key={cmd.id}
                              command={cmd}
                              onClick={() => setSelectedCommand(cmd)}
                              copiedCommand={copiedCommand}
                              copyToClipboard={copyToClipboard}
                              isBookmarked={bookmarkedCommands.has(cmd.id)}
                              toggleBookmark={toggleBookmark}
                              isCompleted={completedCommands.has(cmd.id)}
                              toggleComplete={toggleComplete}
                            />
                          ))
                        ) : (
                          filteredCommands.map(cmd => (
                            <CommandCard
                              key={cmd.id}
                              command={cmd}
                              onClick={() => setSelectedCommand(cmd)}
                              copiedCommand={copiedCommand}
                              copyToClipboard={copyToClipboard}
                              isBookmarked={bookmarkedCommands.has(cmd.id)}
                              toggleBookmark={toggleBookmark}
                              isCompleted={completedCommands.has(cmd.id)}
                              toggleComplete={toggleComplete}
                            />
                          ))
                        )}
                      </div>

                      {filteredCommands.length === 0 && selectedCategory !== 'bookmarks' && (
                        <div className="text-center py-12">
                          <Terminal className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                          <p className="text-slate-600 dark:text-slate-400 text-lg">No commands found matching your criteria</p>
                          <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">Try adjusting your filters or search query</p>
                        </div>
                      )}

                      {selectedCategory === 'bookmarks' && bookmarkedCommandsList.length === 0 && (
                        <div className="text-center py-12">
                          <Star className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                          <p className="text-slate-600 dark:text-slate-400 text-lg">No bookmarked commands yet</p>
                          <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">Click the star icon on any command to bookmark it</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="px-4 py-12 bg-white dark:bg-slate-900 border-t">
              <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-violet-600">{commands.length}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Commands</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-violet-600">{categories.length}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-violet-600">{completedCommands.size}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-violet-600">{commands.reduce((acc, c) => acc + c.examples.length, 0)}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Examples</div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {currentView === 'curriculum' && (
          <section className="py-12 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800">
                  <Bookmark className="w-3 h-3 mr-1" />
                  Learning Paths
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  Structured Curriculum
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Follow our curated learning paths from basics to advanced. Track your progress and master shell commands step by step.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {learningPaths.map(path => {
                  const Icon = path.icon
                  const progress = getLearningPathProgress(path.id)
                  return (
                    <Card key={path.id} className="hover:shadow-md transition-all border-slate-200 dark:border-slate-800">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                              <Icon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{path.title}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge 
                                  variant={path.difficulty === 'beginner' ? 'default' : path.difficulty === 'intermediate' ? 'secondary' : 'destructive'}
                                  className="text-xs"
                                >
                                  {path.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {path.estimatedTime}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Badge 
                            variant={progress === 100 ? 'default' : 'outline'}
                            className={progress === 100 ? 'bg-green-600 hover:bg-green-700' : ''}
                          >
                            {progress}%
                          </Badge>
                        </div>
                        <CardDescription className="mt-2">
                          {path.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-600 dark:text-slate-400">Progress</span>
                              <span className="text-slate-900 dark:text-white font-medium">{path.commands.filter(c => completedCommands.has(c)).length}/{path.commands.length} commands</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {path.commands.slice(0, 5).map(cmdId => (
                              <Badge 
                                key={cmdId}
                                variant={completedCommands.has(cmdId) ? 'default' : 'outline'}
                                className={completedCommands.has(cmdId) ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800' : ''}
                              >
                                {cmdId}
                              </Badge>
                            ))}
                            {path.commands.length > 5 && (
                              <Badge variant="outline">+{path.commands.length - 5} more</Badge>
                            )}
                          </div>
                          <Button 
                            className="w-full"
                            onClick={() => {
                              setCurrentView('home')
                              setSelectedCategory(path.commands[0]?.split('-')[0] as CommandCategory || 'all')
                            }}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {progress > 0 ? 'Continue Learning' : 'Start Learning'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {currentView === 'practice' && (
          <section className="py-12 px-4">
            <div className="container mx-auto max-w-6xl">
              {showTopicSelection ? (
                <>
                  <div className="text-center mb-12">
                    <Badge className="mb-4 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800">
                      <Target className="w-3 h-3 mr-1" />
                      Select a Topic to Practice
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                      Comprehensive Practice Quizzes
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                      Master shell commands with exhaustive practice. Choose a category or practice everything. Track your progress and retry until you achieve mastery.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <Card 
                      className="hover:shadow-lg transition-all cursor-pointer border-slate-200 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-600"
                      onClick={() => startPracticeQuiz('all')}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">All Topics</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">
                                {quizQuestions.length} Questions
                              </Badge>
                              <Badge variant="outline">
                                Mixed Difficulty
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Comprehensive quiz covering all categories with {quizQuestions.length} questions. Test your overall knowledge across all shell command topics.
                        </p>
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500 mb-1">
                            <span>Best Score:</span>
                            <span className="font-semibold">
                              {getTopicProgress('mixed').total > 0 ? `${getTopicProgress('mixed').score}/${getTopicProgress('mixed').total}` : 'Not attempted'}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500 mb-1">
                            <span>Attempts:</span>
                            <span className="font-semibold">
                              {getTopicProgress('mixed').attempts || 0}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {categories.map(cat => {
                      const Icon = cat.icon
                      const progress = getTopicProgress(cat.id)
                      const categoryQuestions = quizQuestions.filter(q => q.category === cat.id)
                      return (
                        <Card 
                          key={cat.id}
                          className="hover:shadow-lg transition-all cursor-pointer border-slate-200 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-600"
                          onClick={() => startPracticeQuiz(cat.id)}
                        >
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                                <Icon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-lg">{cat.name}</CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge 
                                    variant={cat.id === 'basics' ? 'default' : cat.id === 'text' || cat.id === 'files' ? 'secondary' : 'destructive'}
                                    className="text-xs"
                                  >
                                    {cat.difficulty}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {categoryQuestions.length} Questions
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                              {cat.description}
                            </p>
                            <div>
                              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500 mb-1">
                                <span>Best Score:</span>
                                <span className="font-semibold">
                                  {progress.total > 0 ? `${progress.score}/${progress.total}` : 'Not attempted'}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500 mb-1">
                                <span>Attempts:</span>
                                <span className="font-semibold">
                                  {progress.attempts || 0}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500">
                                <span>Mastery:</span>
                                <span className={`font-semibold ${progress.total > 0 && progress.score / progress.total >= 0.8 ? 'text-green-600 dark:text-green-400' : progress.total > 0 && progress.score / progress.total >= 0.6 ? 'text-blue-600 dark:text-blue-400' : progress.total > 0 && progress.score / progress.total >= 0.4 ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                  {progress.total > 0 
                                    ? (progress.score / progress.total >= 0.9 ? 'Mastered (90%+)' 
                                      : progress.score / progress.total >= 0.7 ? 'Proficient (80%+)' 
                                      : progress.score / progress.total >= 0.4 ? 'Learning (60%+)' 
                                      : 'Started')
                                    : 'Not started'}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  <div className="flex justify-center mt-8">
                    <Button size="lg" onClick={selectRandomCategory} variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Random Topic
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowTopicSelection(true)
                          setCurrentQuizQuestions([])
                        }}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Back to Topics
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-base">
                        {currentQuizQuestions.length} Questions
                      </Badge>
                      <Badge variant="outline" className="text-base">
                        {currentQuizIndex + 1}/{currentQuizQuestions.length}
                      </Badge>
                    </div>
                  </div>

                  {!quizCompleted ? (
                    <Card className="border-slate-200 dark:border-slate-800">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-2xl">Practice Quiz</CardTitle>
                            <CardDescription>
                              {practiceCategory === 'all' ? 'Comprehensive Quiz' : categories.find(c => c.id === practiceCategory)?.name}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
                              {currentQuizQuestions[currentQuizIndex].question}
                            </h3>
                            <RadioGroup value={selectedAnswer?.toString()} onValueChange={(val) => !showExplanation && handleAnswerSelect(parseInt(val))}>
                              {currentQuizQuestions[currentQuizIndex].options.map((option, idx) => (
                                <div key={idx} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                  <RadioGroupItem value={idx.toString()} id={`option-${idx}`} disabled={showExplanation} />
                                  <label 
                                    htmlFor={`option-${idx}`}
                                    className={`flex-1 cursor-pointer ${showExplanation && idx === currentQuizQuestions[currentQuizIndex].correctAnswer ? 'text-green-600 dark:text-green-400 font-medium' : showExplanation && selectedAnswer === idx && idx !== currentQuizQuestions[currentQuizIndex].correctAnswer ? 'text-red-600 dark:text-red-400' : ''}`}
                                  >
                                    {option}
                                  </label>
                                  {showExplanation && idx === currentQuizQuestions[currentQuizIndex].correctAnswer && (
                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                  )}
                                  {showExplanation && selectedAnswer === idx && idx !== currentQuizQuestions[currentQuizIndex].correctAnswer && (
                                    <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                                  )}
                                </div>
                              ))}
                            </RadioGroup>
                          </div>

                          {showExplanation && (
                            <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-200 dark:border-violet-800">
                              <p className="text-sm text-slate-700 dark:text-slate-300">
                                <strong className="text-violet-600 dark:text-violet-400">Explanation:</strong> {currentQuizQuestions[currentQuizIndex].explanation}
                              </p>
                              {currentQuizQuestions[currentQuizIndex].commandId && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="mt-3"
                                  onClick={() => {
                                    const cmd = commands.find(c => c.id === currentQuizQuestions[currentQuizIndex].commandId)
                                    if (cmd) setSelectedCommand(cmd)
                                  }}
                                >
                                  <Terminal className="w-4 h-4 mr-2" />
                                  View Command Details
                                </Button>
                              )}
                            </div>
                          )}

                          <div className="flex justify-between items-center">
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              Score: <span className="font-bold text-violet-600 dark:text-violet-400">{quizScore}</span>/{currentQuizQuestions.length}
                            </div>
                            <Button 
                              onClick={nextQuestion}
                              disabled={!showExplanation}
                            >
                              {currentQuizIndex < currentQuizQuestions.length - 1 ? (
                                <>
                                  Next Question
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                              ) : (
                                <>
                                  See Results
                                  <Award className="w-4 h-4 ml-2" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-slate-200 dark:border-slate-800">
                      <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-violet-100 dark:bg-violet-900/30">
                            <Award className="w-10 h-10 text-violet-600 dark:text-violet-400" />
                          </div>
                        </div>
                        <CardTitle className="text-3xl mb-2">Quiz Completed!</CardTitle>
                        <CardDescription className="text-lg mb-6">
                          {practiceCategory === 'all' ? 'Comprehensive Quiz' : categories.find(c => c.id === practiceCategory)?.name} Results
                        </CardDescription>
                        <div className="text-xl">
                          You scored <span className="font-bold text-violet-600 dark:text-violet-400">{quizScore}</span> out of <span className="font-bold">{currentQuizQuestions.length}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="text-center space-y-6">
                        <div>
                          <Progress value={(quizScore / currentQuizQuestions.length) * 100} className="h-4 mb-4" />
                          <p className="text-base text-slate-700 dark:text-slate-300 font-semibold">
                            {(quizScore / currentQuizQuestions.length) * 100 >= 90 ? (
                              <span className="text-green-600 dark:text-green-400">Excellent! You've mastered this topic! 🎉</span>
                            ) : (quizScore / currentQuizQuestions.length) * 100 >= 70 ? (
                              <span className="text-blue-600 dark:text-blue-400">Great job! You're making excellent progress! Keep practicing to reach mastery.</span>
                            ) : (quizScore / currentQuizQuestions.length) * 100 >= 50 ? (
                              <span className="text-yellow-600 dark:text-yellow-400">Good effort! Review the concepts and try again for better results.</span>
                            ) : (
                              <span className="text-slate-600 dark:text-slate-400">Keep learning! You're on the right track. Practice more to improve your score.</span>
                            )}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Button onClick={() => {
                            resetQuiz()
                            setShowTopicSelection(false)
                            startPracticeQuiz(practiceCategory)
                          }} size="lg">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                          </Button>
                          <Button onClick={() => {
                            setCurrentView('home')
                            setSelectedCategory(practiceCategory === 'all' ? 'all' : practiceCategory)
                          }} variant="outline" size="lg">
                            <Terminal className="w-4 h-4 mr-2" />
                            Review Commands
                          </Button>
                        </div>

                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setShowTopicSelection(true)
                            setCurrentQuizQuestions([])
                            setQuizCompleted(false)
                          }}
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Practice Another Topic
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </section>
        )}

        {currentView === 'resources' && (
          <section className="py-12 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Learning Resources
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  Helpful Resources
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Expand your knowledge with these curated resources, documentation, and tools.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.map(resource => (
                  <Card key={resource.id} className="hover:shadow-md transition-all border-slate-200 dark:border-slate-800">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{resource.title}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {resource.category}
                          </Badge>
                        </div>
                        <ExternalLink className="w-5 h-5 text-slate-400 flex-shrink-0 ml-2" />
                      </div>
                      <CardDescription className="mt-2">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Resource
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Command Detail Modal */}
      {selectedCommand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                  <Terminal className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedCommand.name}</h3>
                  <Badge className="mt-1" variant={selectedCommand.difficulty === 'beginner' ? 'default' : selectedCommand.difficulty === 'intermediate' ? 'secondary' : 'destructive'}>
                    {selectedCommand.difficulty}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleComplete(selectedCommand.id)}
                  className={`p-2 rounded-lg transition-colors ${completedCommands.has(selectedCommand.id) ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <CheckCircle className={`w-5 h-5 ${completedCommands.has(selectedCommand.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => toggleBookmark(selectedCommand.id)}
                  className={`p-2 rounded-lg transition-colors ${bookmarkedCommands.has(selectedCommand.id) ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <Star className={`w-5 h-5 ${bookmarkedCommands.has(selectedCommand.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => setSelectedCommand(null)}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <ScrollArea className="h-[calc(90vh-180px)] p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Description</h4>
                  <p className="text-slate-600 dark:text-slate-400">{selectedCommand.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Syntax</h4>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-white font-mono">
                      {selectedCommand.syntax}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(selectedCommand.syntax, 'command')}
                    >
                      {copiedCommand === selectedCommand.syntax ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Examples</h4>
                  <div className="space-y-2">
                    {selectedCommand.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <code className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-white font-mono">
                          {example}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(example, 'example')}
                        >
                          {copiedExample === example ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Pro Tips</h4>
                  <ul className="space-y-2">
                    {selectedCommand.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <ArrowRight className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Category</h4>
                  <Badge variant="outline">
                    {categories.find(c => c.id === selectedCommand.category)?.name}
                  </Badge>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">aimtutor.ai</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              <button onClick={() => setCurrentView('home')} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Commands</button>
              <button onClick={() => setCurrentView('curriculum')} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Curriculum</button>
              <button onClick={() => setCurrentView('practice')} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Practice</button>
              <button onClick={() => setCurrentView('resources')} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Resources</button>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-500">
              © 2025 aimtutor.ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function CommandCard({ command, onClick, copiedCommand, copyToClipboard, isBookmarked, toggleBookmark, isCompleted, toggleComplete }: {
  command: Command
  onClick: () => void
  copiedCommand: string | null
  copyToClipboard: (text: string, type: 'command' | 'example') => void
  isBookmarked: boolean
  toggleBookmark: (id: string) => void
  isCompleted: boolean
  toggleComplete: (id: string) => void
}) {
  const CategoryIcon = categories.find(c => c.id === command.category)?.icon || Terminal

  return (
    <Card 
      className="hover:shadow-md transition-all cursor-pointer group border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-violet-100 dark:bg-violet-900/30 group-hover:bg-violet-200 dark:group-hover:bg-violet-900/50 transition-colors">
              <CategoryIcon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <CardTitle className="text-lg font-mono">{command.name}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleComplete(command.id)
              }}
              className={`p-1.5 rounded-md transition-colors ${isCompleted ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <CheckCircle className={`w-4 h-4 ${isCompleted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleBookmark(command.id)
              }}
              className={`p-1.5 rounded-md transition-colors ${isBookmarked ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        <CardDescription className="text-sm line-clamp-2">
          {command.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge 
              variant={command.difficulty === 'beginner' ? 'default' : command.difficulty === 'intermediate' ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {command.difficulty}
            </Badge>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {command.examples.length} example{command.examples.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono text-slate-700 dark:text-slate-300 overflow-hidden text-ellipsis whitespace-nowrap">
              {command.examples[0]}
            </code>
            <Button
              size="sm"
              variant="ghost"
              className="flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                copyToClipboard(command.examples[0], 'example')
              }}
            >
              {copiedCommand === command.examples[0] ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
