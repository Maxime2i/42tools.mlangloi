'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useUserStore } from '@/store/userStore'
import ProtectedRoute from '@/components/ProtectedRoute'

interface Project {
  id: string
  name: string
  xp: number
  mark: number
  hours: number
  group: boolean
}

interface UserProject {
  project: {
    id: number
    name: string
    slug: string
  }
  status: string
  "validated?": boolean
  final_mark: number | null
}

export default function ProjectsPage() {
  const [userLevel, setUserLevel] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([])
  const [userProjects, setUserProjects] = useState<UserProject[]>([])
  const [availableProjects, setAvailableProjects] = useState<Project[]>([
    { id: 'ft_transcendence', name: 'Ft_transcendence', xp: 24360, mark: 0, hours: 245, group: true },
    { id: '42run', name: '42run', xp: 9450, mark: 0, hours: 98, group: false },
    { id: '42sh', name: '42sh', xp: 15750, mark: 0, hours: 294, group: true },
    { id: 'abstract_data', name: 'Abstract_data', xp: 20084, mark: 0, hours: 290, group: false },
    { id: 'abstract-vm', name: 'Abstract-vm', xp: 9450, mark: 0, hours: 504, group: false },
    { id: 'avaj-launcher', name: 'Avaj-launcher', xp: 4200, mark: 0, hours: 50, group: false },
    { id: 'bgp', name: 'Bgp At Doors of Autonomous Systems', xp: 22450, mark: 0, hours: 200, group: true },
    { id: 'bomberman', name: 'Bomberman', xp: 25200, mark: 0, hours: 196, group: true },
    { id: 'boot2root', name: 'Boot2root', xp: 11500, mark: 0, hours: 49, group: true },
    { id: 'camagru', name: 'Camagru', xp: 4200, mark: 0, hours: 49, group: false },
    { id: 'cloud-1', name: 'Cloud-1', xp: 9450, mark: 0, hours: 100, group: true },
    { id: 'computorv1', name: 'Computorv1', xp: 4200, mark: 0, hours: 49, group: true },
    { id: 'computorv2', name: 'Computorv2', xp: 9450, mark: 0, hours: 147, group: true },
    { id: 'corewar', name: 'Corewar', xp: 17500, mark: 0, hours: 196, group: true },
    { id: 'cow-neck-tid', name: 'Cow-Neck-TID', xp: 30000, mark: 0, hours: 300, group: true },
    { id: 'cpp-module-00', name: 'CPP Module 00', xp: 0, mark: 0, hours: 22, group: true },
    { id: 'cpp-module-01', name: 'CPP Module 01', xp: 0, mark: 0, hours: 12, group: true },
    { id: 'cpp-module-02', name: 'CPP Module 02', xp: 0, mark: 0, hours: 12, group: true },
    { id: 'cpp-module-03', name: 'CPP Module 03', xp: 0, mark: 0, hours: 12, group: true },
    { id: 'cpp-module-04', name: 'CPP Module 04', xp: 9660, mark: 0, hours: 12, group: true },
    { id: 'cpp-module-05', name: 'CPP Module 05', xp: 0, mark: 0, hours: 25, group: true },
    { id: 'cpp-module-06', name: 'CPP Module 06', xp: 0, mark: 0, hours: 25, group: true },
    { id: 'cpp-module-07', name: 'CPP Module 07', xp: 0, mark: 0, hours: 25, group: true },
    { id: 'cpp-module-08', name: 'CPP Module 08', xp: 0, mark: 0, hours: 25, group: true },
    { id: 'cpp-module-09', name: 'CPP Module 09', xp: 10042, mark: 0, hours: 40, group: true },
    { id: 'cub3d', name: 'Cub3d', xp: 5775, mark: 0, hours: 280, group: true },
    { id: 'cybersecurity', name: 'Cybersecurity', xp: 0, mark: 0, hours: 63, group: true },
    { id: 'cybersecurity-arachnida', name: 'Cybersecurity - arachnida - Web', xp: 1350, mark: 0, hours: 7, group: true },
    { id: 'cybersecurity-ft-onion', name: 'Cybersecurity - ft_onion - Web', xp: 1350, mark: 0, hours: 7, group: true },
    { id: 'cybersecurity-ft-otp', name: 'Cybersecurity - ft_otp - OTP', xp: 1350, mark: 0, hours: 7, group: true },
    { id: 'cybersecurity-inquisitor', name: 'Cybersecurity - Inquisitor - Network', xp: 1350, mark: 0, hours: 7, group: true },
    { id: 'cybersecurity-reverse-me', name: 'Cybersecurity - Reverse me - Rev', xp: 1350, mark: 0, hours: 7, group: true },
    { id: 'cybersecurity-stockholm', name: 'Cybersecurity - Stockholm - Malware', xp: 1350, mark: 0, hours: 7, group: true },
    { id: 'cybersecurity-vaccine', name: 'Cybersecurity - Vaccine - Web', xp: 1350, mark: 0, hours: 7, group: true },
    { id: 'darkly', name: 'darkly', xp: 6300, mark: 0, hours: 98, group: true },
    { id: 'data-science-0', name: 'Data Science - 0', xp: 545, mark: 0, hours: 7, group: true },
    { id: 'data-science-1', name: 'Data Science - 1', xp: 545, mark: 0, hours: 7, group: true },
    { id: 'data-science-2', name: 'Data Science - 2', xp: 545, mark: 0, hours: 7, group: true },
    { id: 'data-science-3', name: 'Data Science - 3', xp: 545, mark: 0, hours: 7, group: true },
    { id: 'data-science-4', name: 'Data Science - 4', xp: 2545, mark: 0, hours: 7, group: true },
    { id: 'death', name: 'death', xp: 35700, mark: 0, hours: 147, group: true },
    { id: 'django-0-initiation', name: 'Django - 0 - Initiation', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'django-0-oob', name: 'Django - 0 - Oob', xp: 1500, mark: 0, hours: 7, group: true },
    { id: 'django-0-starting', name: 'Django - 0 - Starting', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'django-1-base', name: 'Django - 1 - Base Django', xp: 3475, mark: 0, hours: 7, group: true },
    { id: 'django-1-lib', name: 'Django - 1 - Lib', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'django-2-sql', name: 'Django - 2 - SQL', xp: 1000, mark: 0, hours: 7, group: true },
    { id: 'django-3-advanced', name: 'Django - 3 - Advanced', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'django-3-final', name: 'Django - 3 - Final', xp: 3475, mark: 0, hours: 7, group: true },
    { id: 'django-3-sessions', name: 'Django - 3 - Sessions', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'doom-nukem', name: 'doom-nukem', xp: 15750, mark: 0, hours: 294, group: true },
    { id: 'drivers-and-interrupts', name: 'drivers-and-interrupts', xp: 15750, mark: 0, hours: 98, group: true },
    { id: 'dr-quine', name: 'dr-quine', xp: 2520, mark: 0, hours: 14, group: true },
    { id: 'dslr', name: 'dslr', xp: 6000, mark: 0, hours: 98, group: true },
    { id: 'electronics-old', name: 'Electronics-Old', xp: 0, mark: 0, hours: 0, group: true },
    { id: 'electronique', name: 'Electronique', xp: 35700, mark: 0, hours: 0, group: true },
    { id: 'expert-system', name: 'expert-system', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'famine', name: 'famine', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'fdf', name: 'FdF', xp: 1000, mark: 0, hours: 60, group: true },
    { id: 'filesystem', name: 'filesystem', xp: 15750, mark: 0, hours: 196, group: true },
    { id: 'fix-me', name: 'fix-me', xp: 15750, mark: 0, hours: 196, group: true },
    { id: 'fract-ol', name: 'fract-ol', xp: 1000, mark: 0, hours: 60, group: true },
    { id: 'fr-alternance-rncp6-1', name: 'FR - Alternance - RNCP6 - 1 an', xp: 90000, mark: 0, hours: 8760, group: true },
    { id: 'fr-alternance-rncp6-2', name: 'FR - Alternance - RNCP6 - 2 ans', xp: 150000, mark: 0, hours: 17520, group: true },
    { id: 'fr-alternance-rncp7-1', name: 'FR - Alternance - RNCP7 - 1 an', xp: 90000, mark: 0, hours: 8760, group: true },
    { id: 'fr-alternance-rncp7-2', name: 'FR - Alternance - RNCP7 - 2 ans', xp: 180000, mark: 0, hours: 17520, group: true },
    { id: 'fr-apprentissage-rncp6-1', name: 'FR Apprentissage RNCP 6 - 1 an', xp: 90000, mark: 0, hours: 8760, group: true },
    { id: 'fr-apprentissage-rncp6-2', name: 'FR Apprentissage RNCP 6 - 2 ans', xp: 150000, mark: 0, hours: 17520, group: true },
    { id: 'fr-apprentissage-rncp7-1', name: 'FR Apprentissage RNCP 7 - 1 an', xp: 90000, mark: 0, hours: 8760, group: true },
    { id: 'fr-apprentissage-rncp7-2', name: 'FR Apprentissage RNCP 7 - 2 ans', xp: 180000, mark: 0, hours: 17520, group: true },
    { id: 'freddie-mercury', name: 'freddie-mercury', xp: 12600, mark: 0, hours: 360, group: true },
    { id: 'ft_ality', name: 'ft_ality', xp: 4200, mark: 0, hours: 98, group: true },
    { id: 'ft_containers', name: 'ft_containers', xp: 10042, mark: 0, hours: 140, group: true },
    { id: 'ft_hangouts', name: 'ft_hangouts', xp: 4200, mark: 0, hours: 49, group: true },
    { id: 'ft_irc', name: 'ft_irc', xp: 21630, mark: 0, hours: 175, group: true },
    { id: 'ft_kalman', name: 'ft_kalman', xp: 16800, mark: 0, hours: 210, group: true },
    { id: 'ft_linear_regression', name: 'ft_linear_regression', xp: 4200, mark: 0, hours: 70, group: true },
    { id: 'ft_linux', name: 'ft_linux', xp: 4200, mark: 0, hours: 49, group: true },
    { id: 'ftl_quantum', name: 'Ftl_quantum', xp: 6500, mark: 0, hours: 98, group: true },
    { id: 'ft_ls', name: 'ft_ls', xp: 4200, mark: 0, hours: 49, group: true },
    { id: 'ft_malcolm', name: 'ft_malcolm', xp: 6000, mark: 0, hours: 49, group: true },
    { id: 'ft_minecraft', name: 'ft_minecraft', xp: 20750, mark: 0, hours: 560, group: true },
    { id: 'ft_newton', name: 'ft_newton', xp: 24360, mark: 0, hours: 98, group: true },
    { id: 'ft_nmap', name: 'ft_nmap', xp: 15750, mark: 0, hours: 49, group: true },
    { id: 'ft_ping', name: 'ft_ping', xp: 4200, mark: 0, hours: 49, group: true },
    { id: 'ft_printf', name: 'ft_printf', xp: 882, mark: 0, hours: 70, group: true },
    { id: 'ft_script', name: 'ft_script', xp: 4200, mark: 0, hours: 168, group: true },
    { id: 'ft_select', name: 'ft_select', xp: 4200, mark: 0, hours: 168, group: true },
    { id: 'ft_server', name: 'ft_server', xp: 1722, mark: 0, hours: 84, group: true },
    { id: 'ft_services', name: 'ft_services', xp: 10042, mark: 0, hours: 210, group: true },
    { id: 'ft_shield', name: 'ft_shield', xp: 15750, mark: 0, hours: 196, group: true },
    { id: 'ft_ssl_des', name: 'ft_ssl_des', xp: 9450, mark: 0, hours: 49, group: true },
    { id: 'ft_ssl_md5', name: 'ft_ssl_md5', xp: 9450, mark: 0, hours: 49, group: true },
    { id: 'ft_ssl_rsa', name: 'ft_ssl_rsa', xp: 15750, mark: 0, hours: 49, group: true },
    { id: 'ft_traceroute', name: 'ft_traceroute', xp: 4200, mark: 0, hours: 49, group: true },
    { id: 'ft_turing', name: 'ft_turing', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'ft_vox', name: 'ft_vox', xp: 15750, mark: 0, hours: 147, group: true },
    { id: 'gbmu', name: 'gbmu', xp: 31500, mark: 0, hours: 420, group: true },
    { id: 'get_next_line', name: 'get_next_line', xp: 882, mark: 0, hours: 70, group: true },
    { id: 'gomoku', name: 'gomoku', xp: 25200, mark: 0, hours: 196, group: true },
    { id: 'guimp', name: 'guimp', xp: 12600, mark: 0, hours: 147, group: true },
    { id: 'h42n42', name: 'h42n42', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'humangl', name: 'humangl', xp: 4200, mark: 0, hours: 49, group: true },
    { id: 'hypertube', name: 'hypertube', xp: 15750, mark: 0, hours: 196, group: true },
    { id: 'inception', name: 'Inception', xp: 10042, mark: 0, hours: 210, group: true },
    { id: 'inception-of-things', name: 'Inception-of-Things', xp: 25450, mark: 0, hours: 200, group: true },
    { id: 'internship-1', name: 'Internship I', xp: 42000, mark: 0, hours: 2880, group: true },
    { id: 'internship-2', name: 'Internship II', xp: 63000, mark: 0, hours: 2880, group: true },
    { id: 'in-the-shadows', name: 'in-the-shadows', xp: 9450, mark: 0, hours: 147, group: true },
    { id: 'kfs-1', name: 'kfs-1', xp: 15750, mark: 0, hours: 294, group: true },
    { id: 'kfs-2', name: 'kfs-2', xp: 15750, mark: 0, hours: 294, group: true },
    { id: 'kfs-3', name: 'kfs-3', xp: 35700, mark: 0, hours: 294, group: true },
    { id: 'kfs-4', name: 'kfs-4', xp: 25200, mark: 0, hours: 196, group: true },
    { id: 'kfs-5', name: 'kfs-5', xp: 35700, mark: 0, hours: 392, group: true },
    { id: 'kfs-6', name: 'kfs-6', xp: 25200, mark: 0, hours: 294, group: true },
    { id: 'kfs-7', name: 'kfs-7', xp: 35700, mark: 0, hours: 630, group: true },
    { id: 'kfs-8', name: 'kfs-8', xp: 15750, mark: 0, hours: 196, group: true },
    { id: 'kfs-9', name: 'kfs-9', xp: 15750, mark: 0, hours: 245, group: true },
    { id: 'kfs-x', name: 'kfs-x', xp: 35700, mark: 0, hours: 56, group: true },
    { id: 'krpsim', name: 'krpsim', xp: 9450, mark: 0, hours: 49, group: true },
    { id: 'leaffliction', name: 'Leaffliction', xp: 15750, mark: 0, hours: 294, group: true },
    { id: 'learn2slither', name: 'Learn2Slither', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'lem_in', name: 'lem_in', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'lem-ipc', name: 'lem-ipc', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'libasm', name: 'libasm', xp: 966, mark: 0, hours: 20, group: true },
    { id: 'libft', name: 'Libft', xp: 462, mark: 0, hours: 70, group: true },
    { id: 'libftpp', name: 'libftpp', xp: 5880, mark: 0, hours: 98, group: true },
    { id: 'little-penguin-1', name: 'little-penguin-1', xp: 9450, mark: 0, hours: 100, group: true },
    { id: 'malloc', name: 'malloc', xp: 9450, mark: 0, hours: 49, group: true },
    { id: 'matcha', name: 'matcha', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'matrix', name: 'matrix', xp: 7000, mark: 0, hours: 110, group: true },
    { id: 'matt-daemon', name: 'matt-daemon', xp: 9450, mark: 0, hours: 49, group: true },
    { id: 'minirt', name: 'miniRT', xp: 5775, mark: 0, hours: 280, group: true },
    { id: 'minishell', name: 'minishell', xp: 2814, mark: 0, hours: 210, group: true },
    { id: 'minitalk', name: 'minitalk', xp: 1142, mark: 0, hours: 50, group: true },
    { id: 'mobile', name: 'Mobile', xp: 0, mark: 0, hours: 63, group: true },
    { id: 'mobile-0-basic', name: 'Mobile - 0 - Basic of the mobile application', xp: 500, mark: 0, hours: 7, group: true },
    { id: 'mobile-1-structure', name: 'Mobile - 1 - Structure and logic', xp: 950, mark: 0, hours: 7, group: true },
    { id: 'mobile-2-api', name: 'Mobile - 2 - API and data', xp: 1000, mark: 0, hours: 7, group: true },
    { id: 'mobile-3-design', name: 'Mobile - 3 - Design', xp: 2000, mark: 0, hours: 7, group: true },
    { id: 'mobile-4-auth', name: 'Mobile - 4 - Auth and dataBase', xp: 2000, mark: 0, hours: 7, group: true },
    { id: 'mobile-5-manage', name: 'Mobile - 5 - Manage data and display', xp: 3000, mark: 0, hours: 7, group: true },
    { id: 'mod1', name: 'mod1', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'multilayer-perceptron', name: 'multilayer-perceptron', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'music-room', name: 'music-room', xp: 25200, mark: 0, hours: 196, group: true },
    { id: 'netpractice', name: 'NetPractice', xp: 3160, mark: 0, hours: 50, group: true },
    { id: 'nibbler', name: 'nibbler', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'nm', name: 'nm', xp: 9450, mark: 0, hours: 360, group: true },
    { id: 'n-puzzle', name: 'n-puzzle', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'ocaml-basic-syntax-0', name: 'OCAML - Basic syntax and semantics - 0', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'ocaml-functor-1', name: 'OCAML - Functor - 1', xp: 2250, mark: 0, hours: 7, group: true },
    { id: 'ocaml-imperative-1', name: 'OCAML - Imperative features - 1', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'ocaml-monoids-monads-3', name: 'OCAML - Monoids and Monads - 3', xp: 3475, mark: 0, hours: 7, group: true },
    { id: 'ocaml-oop-1', name: 'OCAML - Object Oriented Programming - 1', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'ocaml-oop-2', name: 'OCAML - Object Oriented Programming - 2', xp: 2225, mark: 0, hours: 7, group: true },
    { id: 'ocaml-modules-1', name: 'OCAML - OCaml\'s modules language - 1', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'ocaml-pattern-matching-0', name: 'OCAML - Pattern Matching and Data Types - 0', xp: 1500, mark: 0, hours: 7, group: true },
    { id: 'ocaml-recursion-0', name: 'OCAML - Recursion and higher-order functions - 0', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'old-irc', name: 'Old-IRC', xp: 21630, mark: 0, hours: 175, group: true },
    { id: 'old-philosophers', name: 'Old-Philosophers', xp: 3360, mark: 0, hours: 70, group: true },
    { id: 'open-project', name: 'Open Project', xp: 31500, mark: 0, hours: 1440, group: true },
    { id: 'cybersecurity-iron-dome', name: '(Optional) Cybersecurity - Iron Dome - Malware', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'override', name: 'override', xp: 35700, mark: 0, hours: 196, group: true },
    { id: 'particle-system', name: 'particle-system', xp: 15750, mark: 0, hours: 147, group: true },
    { id: 'part-time-1', name: 'Part_Time I', xp: 42000, mark: 0, hours: 2880, group: true },
    { id: 'part-time-2', name: 'Part_Time II', xp: 63000, mark: 0, hours: 2880, group: true },
    { id: 'peace-break', name: 'Peace_Break', xp: 9000, mark: 0, hours: 98, group: true },
    { id: 'pestilence', name: 'pestilence', xp: 15750, mark: 0, hours: 196, group: true },
    { id: 'philosophers', name: 'Philosophers', xp: 3360, mark: 0, hours: 70, group: true },
    { id: 'pipex', name: 'pipex', xp: 1142, mark: 0, hours: 50, group: true },
    { id: 'piscine-data-science', name: 'Piscine Data Science', xp: 0, mark: 0, hours: 35, group: true },
    { id: 'piscine-django', name: 'Piscine Django', xp: 0, mark: 0, hours: 63, group: true },
    { id: 'piscine-object', name: 'Piscine Object', xp: 0, mark: 0, hours: 64, group: true },
    { id: 'piscine-object-00', name: 'Piscine Object - Module 00 - Encapsulation', xp: 945, mark: 0, hours: 7, group: true },
    { id: 'piscine-object-01', name: 'Piscine Object - Module 01 - Relationship', xp: 945, mark: 0, hours: 7, group: true },
    { id: 'piscine-object-02', name: 'Piscine Object - Module 02 - UML', xp: 1890, mark: 0, hours: 7, group: true },
    { id: 'piscine-object-03', name: 'Piscine Object - Module 03 - SOLID', xp: 1890, mark: 0, hours: 7, group: true },
    { id: 'piscine-object-04', name: 'Piscine Object - Module 04 - Design Pattern', xp: 1890, mark: 0, hours: 7, group: true },
    { id: 'piscine-object-05', name: 'Piscine Object - Module 05 - Practical work', xp: 1890, mark: 0, hours: 14, group: true },
    { id: 'piscine-ocaml', name: 'Piscine ocaml', xp: 0, mark: 0, hours: 63, group: true },
    { id: 'piscine-php-symfony', name: 'Piscine PHP Symfony', xp: 9450, mark: 0, hours: 1440, group: true },
    { id: 'piscine-ror', name: 'Piscine RoR', xp: 0, mark: 0, hours: 63, group: true },
    { id: 'piscine-ruby-on-rails', name: 'Piscine Ruby on Rails', xp: 9450, mark: 0, hours: 1440, group: true },
    { id: 'piscine-symfony', name: 'Piscine Symfony', xp: 0, mark: 0, hours: 63, group: true },
    { id: 'process-and-memory', name: 'process-and-memory', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'push_swap', name: 'push_swap', xp: 1855, mark: 0, hours: 60, group: true },
    { id: 'python-0-starting', name: 'Python - 0 - Starting', xp: 545, mark: 0, hours: 7, group: true },
    { id: 'python-1-array', name: 'Python - 1 - Array', xp: 545, mark: 0, hours: 7, group: true },
    { id: 'python-2-datatable', name: 'Python - 2 - DataTable', xp: 545, mark: 0, hours: 7, group: true },
    { id: 'python-3-oop', name: 'Python - 3 - OOP', xp: 545, mark: 0, hours: 7, group: true },
    { id: 'python-4-dod', name: 'Python - 4 - Dod', xp: 2545, mark: 0, hours: 7, group: true },
    { id: 'python-for-data-science', name: 'Python for Data Science', xp: 0, mark: 0, hours: 35, group: true },
    { id: 'rainfall', name: 'rainfall', xp: 25200, mark: 0, hours: 672, group: true },
    { id: 'ready-set-boole', name: 'ready set boole', xp: 7000, mark: 0, hours: 110, group: true },
    { id: 'red-tetris', name: 'red-tetris', xp: 15750, mark: 0, hours: 147, group: true },
    { id: 'ror-0-initiation', name: 'RoR - 0 - Initiation', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'ror-0-oob', name: 'RoR - 0 - Oob', xp: 1500, mark: 0, hours: 7, group: true },
    { id: 'ror-0-starting', name: 'RoR - 0 - Starting', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'ror-1-base-rails', name: 'RoR - 1 - Base Rails', xp: 3475, mark: 0, hours: 7, group: true },
    { id: 'ror-1-gems', name: 'RoR - 1 - Gems', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'ror-2-sql', name: 'RoR - 2 - SQL', xp: 1000, mark: 0, hours: 7, group: true },
    { id: 'ror-3-advanced', name: 'RoR - 3 - Advanced', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'ror-3-final', name: 'RoR - 3 - Final', xp: 3475, mark: 0, hours: 7, group: true },
    { id: 'ror-3-sessions', name: 'RoR - 3 - Sessions', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'rt', name: 'rt', xp: 20750, mark: 0, hours: 294, group: true },
    { id: 'rubik', name: 'rubik', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'rushes', name: 'Rushes', xp: 0, mark: 0, hours: 2, group: true },
    { id: 'scop', name: 'scop', xp: 9450, mark: 0, hours: 49, group: true },
    { id: 'shaderpixel', name: 'shaderpixel', xp: 15750, mark: 0, hours: 147, group: true },
    { id: 'snow-crash', name: 'snow-crash', xp: 9450, mark: 0, hours: 147, group: true },
    { id: 'so_long', name: 'so_long', xp: 1000, mark: 0, hours: 60, group: true },
    { id: 'startup-internship', name: 'Startup Internship', xp: 42000, mark: 0, hours: 2880, group: true },
    { id: 'strace', name: 'strace', xp: 9450, mark: 0, hours: 49, group: true },
    { id: 'swifty-companion', name: 'swifty-companion', xp: 4200, mark: 0, hours: 49, group: true },
    { id: 'swifty-proteins', name: 'swifty-proteins', xp: 15750, mark: 0, hours: 147, group: true },
    { id: 'swingy', name: 'swingy', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'symfony-0-initiation', name: 'Symfony - 0 - Initiation', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'symfony-0-oob', name: 'Symfony - 0 - Oob', xp: 1500, mark: 0, hours: 7, group: true },
    { id: 'symfony-0-starting', name: 'Symfony - 0 - Starting', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'symfony-1-base', name: 'Symfony - 1 - Base Symfony', xp: 3475, mark: 0, hours: 7, group: true },
    { id: 'symfony-1-composer', name: 'Symfony - 1 - Composer', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'symfony-2-sql', name: 'Symfony - 2 - SQL', xp: 1000, mark: 0, hours: 7, group: true },
    { id: 'symfony-3-advanced', name: 'Symfony - 3 - Advanced', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'symfony-3-final', name: 'Symfony - 3 - Final', xp: 3475, mark: 0, hours: 7, group: true },
    { id: 'symfony-3-sessions', name: 'Symfony - 3 - Sessions', xp: 0, mark: 0, hours: 7, group: true },
    { id: 'taskmaster', name: 'taskmaster', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'tinky-winkey', name: 'tinky-winkey', xp: 16800, mark: 0, hours: 210, group: true },
    { id: 'tokenize-art', name: 'TokenizeArt', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'tokenizer', name: 'Tokenizer', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'total-perspective-vortex', name: 'total-perspective-vortex', xp: 9450, mark: 0, hours: 98, group: true },
    { id: 'unity', name: 'Unity', xp: 0, mark: 0, hours: 49, group: true },
    { id: 'unity-0-basics', name: 'Unity - 0 - The basics Unity tools', xp: 500, mark: 0, hours: 7, group: true },
    { id: 'unity-1-physics', name: 'Unity - 1 - 3D physics, Tags, Layers and Scene', xp: 500, mark: 0, hours: 7, group: true },
    { id: 'unity-2-2d', name: 'Unity - 2 - 2D environment, tiles and sprites', xp: 1000, mark: 0, hours: 7, group: true },
    { id: 'unity-3-inputs', name: 'Unity - 3 - Advanced inputs and 2D GUI', xp: 1000, mark: 0, hours: 7, group: true },
    { id: 'unity-4-animations', name: 'Unity - 4 - Animations and Sound', xp: 1000, mark: 0, hours: 7, group: true },
    { id: 'unity-5-singleton', name: 'Unity - 5 - Singleton, playerPrefs and coroutines', xp: 2000, mark: 0, hours: 7, group: true },
    { id: 'unity-6-navmesh', name: 'Unity - 6 - Navmesh, light, sound and camera', xp: 3450, mark: 0, hours: 7, group: true },
    { id: 'unleash-the-box', name: 'UnleashTheBox', xp: 15750, mark: 0, hours: 147, group: true },
    { id: 'userspace-digressions', name: 'userspace_digressions', xp: 16800, mark: 0, hours: 294, group: true },
    { id: 'very-real-engine', name: 'Very_Real_Engine', xp: 30000, mark: 0, hours: 600, group: true },
    { id: 'war', name: 'war', xp: 35700, mark: 0, hours: 196, group: true },
    { id: 'webserv', name: 'webserv', xp: 21630, mark: 0, hours: 175, group: true },
    { id: 'woody-woodpacker', name: 'woody-woodpacker', xp: 9450, mark: 0, hours: 49, group: true },
    { id: 'xv', name: 'xv', xp: 22000, mark: 0, hours: 392, group: true },
    { id: 'zappy', name: 'zappy', xp: 25200, mark: 0, hours: 294, group: true }
  ])
  const { userInfo, fetchUserInfo } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    const initializeUserData = async () => {
      if (!localStorage.getItem('accessToken')) {
        router.push('/')
        return
      }

      try {
        await fetchUserInfo()
      } catch (error) {
        console.error('Erreur:', error)
        router.push('/')
      }
    }

    if (!userInfo) {
      initializeUserData()
    } else {
      // Mettre à jour les états avec les données du store
      setUserLevel(userInfo.cursus_users.find((cursus: any) => 
        cursus.cursus_id === 21
      )?.level || 0)
      
      setUserProjects(userInfo.projects_users)
    }
  }, [userInfo, fetchUserInfo, router])

  const isProjectCompleted = (projectId: string): boolean => {
    return userProjects.some(p => {
      const projectSlug = p.project.slug.toLowerCase()
      const searchSlug = projectId.toLowerCase()
      const isMatch = projectSlug === searchSlug ||
                     projectSlug === `42cursus-${searchSlug}` ||
                     projectSlug.replace('42cursus-', '') === searchSlug
      return isMatch && p.status === 'finished' && p["validated?"] === true
    })
  }

  const calculateTotalXP = () => {
    return selectedProjects.reduce((total, project) => {
      const projectXP = project.xp * (project.mark / 100)
      return total + projectXP
    }, 0)
  }

  const calculateNewLevel = () => {
    // On récupère l'XP des nouveaux projets
    const additionalXP = calculateTotalXP()
    
    // On convertit le niveau actuel en XP approximative
    // Formule inverse de celle utilisée pour calculer le niveau
    const currentLevelXP = Math.pow(userLevel * 2, 2) * 100
    
    // On additionne l'XP actuelle et l'XP additionnelle
    const totalXP = currentLevelXP + additionalXP
    
    // On reconvertit en niveau
    return (Math.sqrt(totalXP / 100) / 2).toFixed(2)
  }

  const filteredProjects = availableProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedProjects.some(sp => sp.id === project.id) &&
    !isProjectCompleted(project.id)
  )

  const handleAddProject = (project: Project) => {
    setSelectedProjects([...selectedProjects, { ...project, mark: 100 }])
  }

  const handleMarkChange = (projectId: string, mark: number) => {
    setSelectedProjects(selectedProjects.map(project =>
      project.id === projectId
        ? { ...project, mark: Math.min(Math.max(mark, 0), 125) }
        : project
    ))
  }

  const handleRemoveProject = (projectId: string) => {
    setSelectedProjects(selectedProjects.filter(project => project.id !== projectId))
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-black text-white p-4 md:p-8 space-y-4 md:space-y-8">
      <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500">
        Simulateur de niveau
      </h1>

      {/* Barre de niveau */}
      <Card className="border-white/10 bg-zinc-900/50 backdrop-blur">
        <CardHeader className="border-b border-white/10">
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <CardTitle className="text-2xl font-light tracking-tight text-white">
                Niveau actuel : {userLevel.toFixed(2)}
              </CardTitle>
              <CardTitle className="text-2xl font-light tracking-tight text-white/80 mt-2 md:mt-0">
                Niveau simulé : {calculateNewLevel()}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Progress 
            value={Math.min((Number(calculateNewLevel()) / 21) * 100, 100)} 
            className="h-2 bg-white/10" 
            indicatorClassName="bg-gradient-to-r from-green-700 to-green-300"
          />
        </CardContent>
      </Card>


      {/* Projets sélectionnés */}
      <Card className="border-white/10 bg-zinc-900/50 backdrop-blur">
        <CardContent className="space-y-4">
          {selectedProjects.map(project => (
            <div key={project.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-white/5 rounded-lg hover:border-white/20 transition-colors space-y-2 md:space-y-0">
              <div className="flex flex-col">
                <span className="font-medium text-white">{project.name}</span>
                <span className="text-sm text-gray-400">XP: {project.xp} - {project.hours}h</span>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2 text-white w-full md:w-auto">
                  <input
                    type="number"
                    min="0"
                    max="125"
                    value={project.mark}
                    onChange={(e) => handleMarkChange(project.id, Number(e.target.value))}
                    className="w-full md:w-16 text-right px-2 py-1 bg-zinc-800 border border-white/10 rounded text-white"
                  />
                  <span>/125</span>
                </div>
                <Button
                  onClick={() => handleRemoveProject(project.id)}
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-950/20 w-full md:w-auto"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>



      {/* Barre de recherche */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Rechercher un projet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-zinc-900/50 border-white/10 text-white placeholder:text-gray-400"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
        
              {/* Liste des projets trouvés */}
              {searchTerm && (
                <Card className="border-white/10 bg-zinc-900/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-2xl font-light tracking-tight text-white">
                      Résultats de la recherche
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map(project => (
                        <div
                          key={project.id}
                          className="flex justify-between items-center p-4 border border-white/5 rounded-lg hover:border-white/20 transition-colors"
                        >
                          <span className="text-white">
                            {project.name} - {project.xp} XP - {project.hours}h
                          </span>
                          <Button
                            onClick={() => handleAddProject(project)}
                            className="bg-white/10 hover:bg-white/20 text-white transition-colors"
                          >
                            Ajouter
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-400">
                        Aucun projet trouvé pour "{searchTerm}"
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

    </div>
    </ProtectedRoute>
  )
}