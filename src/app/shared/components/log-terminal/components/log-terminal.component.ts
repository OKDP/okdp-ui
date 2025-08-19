import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LogStreamingService } from '../services/log-streaming.service';
import { formatAndColorize, RESET, COLORS, errorMessage } from '../../../utils';

@Component({
  selector: 'app-log-terminal',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './log-terminal.component.html',
  styleUrls: ['./log-terminal.component.scss'],
})
export class LogTerminalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('terminalContainer', { static: true }) terminalContainer!: ElementRef<HTMLDivElement>;
  @Input() logUrl = '';
  @Input() pod = '';
  @Input() container = '';

  terminal!: Terminal;
  fitAddon!: FitAddon;

  paused = false;
  autoScroll = true;

  private logBuffer: string[] = [];
  private logSubscription?: Subscription;
  private resizeObserver!: ResizeObserver;

  constructor(private logStreamingService: LogStreamingService) {}

  ngOnInit(): void {
    this.initTerminal();
    this.subscribeToLogs();
  }

  private initTerminal(): void {
    this.terminal = new Terminal({
      cursorBlink: false,
      fontSize: 14,
      fontWeight: 'normal',
      lineHeight: 1.4,
      convertEol: true,
      theme: {
        background: getComputedStyle(document.documentElement).getPropertyValue('--card-bg-color') || '#1e1e1e',
        foreground: getComputedStyle(document.documentElement).getPropertyValue('--text-primary-color') || '#d4d4d4',
        selectionBackground:
          getComputedStyle(document.documentElement).getPropertyValue('--theme-text-secondary') || '#B2DFDB',
      },
    });
    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);
    this.terminal.open(this.terminalContainer.nativeElement);
  }

  private subscribeToLogs(): void {
    this.logSubscription?.unsubscribe();
    this.logBuffer = [];
    this.terminal.clear();

    this.logSubscription = this.logStreamingService.streamLogs(this.logUrl).subscribe({
      next: (line: string) => {
        const colored = formatAndColorize(line);

        if (this.paused) {
          this.logBuffer.push(colored);
        } else {
          this.terminal.write(' ' + colored + '\r\n');
          if (this.autoScroll) {
            this.terminal.scrollToBottom();
          }
        }
      },
      error: (err: any) => {
        const msg = errorMessage(err) || 'Connection lost. Trying to reconnect...';
        const line = `${COLORS['ERROR']}${msg}${RESET}`;
        this.terminal.writeln(line + '\r\n');
      },
    });
  }

  togglePause(): void {
    this.paused = !this.paused;
    if (!this.paused && this.logBuffer.length > 0) {
      this.terminal.write(this.logBuffer.join('\r\n') + '\r\n');
      if (this.autoScroll) {
        this.terminal.scrollToBottom();
      }
      this.logBuffer = [];
    }
  }

  toggleAutoScroll(): void {
    this.autoScroll = !this.autoScroll;
  }

  downloadLogs(): void {
    if (!this.logUrl) return;

    this.logStreamingService.downloadLogs(this.logUrl).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `logs-${this.pod}-${this.container}.log`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: err => {
        console.error('Failed to download logs:', err);
      },
    });
  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.fitTerminalToContainer();
    });
    this.resizeObserver.observe(this.terminalContainer.nativeElement);
    this.fitTerminalToContainer();
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
    this.logSubscription?.unsubscribe();
    this.terminal.dispose();
  }

  private fitTerminalToContainer() {
    this.fitAddon.fit();
  }
}
